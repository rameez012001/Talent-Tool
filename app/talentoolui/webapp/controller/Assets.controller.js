sap.ui.define(["sap/ui/core/mvc/Controller", "sap/ui/core/Fragment"], (Controller, Fragment) => {
    "use strict"
    return Controller.extend("talentoolui.controller.Assets", {
        onInit() {
            this.getView().setModel(this.getOwnerComponent().getModel(), "Assets");
            this._oEventBus = sap.ui.getCore().getEventBus();
            this._oEventBus.subscribe(
                "globalSearch",
                "filter",
                this.onSearch,
                this
            );
        },
        onSearch: function (sChannel, sEvent, oData) {
            const sQuery = oData.query;

            const oTable = this.byId("Assets");
            if (!oTable) {
                return;
            }

            const oBinding = oTable.getBinding("items");
            if (!oBinding) {
                return;
            }

            if (sQuery) {
                const aFilters = [
                    new sap.ui.model.Filter({
                        path: `assetTag`,
                        operator: sap.ui.model.FilterOperator.Contains,
                        value1: sQuery,
                        caseSensitive: false
                    })
                ];
                const oOrFilter = new sap.ui.model.Filter({
                    filters: aFilters,
                    and: false // OR condition
                });
                oBinding.filter(oOrFilter);
            } else {
                oBinding.filter([]);
            }
        },

        onAssetItemPressed: function (oEvent) {
            const oItem = oEvent.getSource();
            const oCtx = oItem.getBindingContext();
            const sId = oCtx.getProperty("ID");
            this.getOwnerComponent()
                .getRouter()
                .navTo("RouteAssetObject", { id: sId });

        },
        assetStatus: function (sStatus) {
            switch (sStatus.toUpperCase()) {
                case "MAINTENANCE":
                    return "Error";
                case "IN_USE":
                    return "Warning";
                case "AVAILABLE":
                    return "Success";
                default:
                    return "None";
            }
        },
        // openQuickUserView: function (oEvent) {
        // 	var oButton = oEvent.getSource(),
        // 		oView = this.getView();
        //     var oModel = this.getView().getModel("Assets");

        // 	if (!this._pQuickView) {
        // 		this._pQuickView = Fragment.load({
        // 			id: oView.getId(),
        // 			name: "talentoolui.view.fragments.QuickUserView",
        // 			controller: this
        // 		}).then(function (oQuickView) {
        // 			oView.addDependent(oQuickView);
        // 			return oQuickView;
        // 		});
        // 	}
        // 	this._pQuickView.then(function (oQuickView){
        // 		oQuickView.setModel(oModel);
        // 		oQuickView.openBy(oButton);
        // 	});
        // },

        // openQuickUserView1: function (oEvent) {
        //     var oButton = oEvent.getSource();
        //     var oCtx = oButton.getBindingContext(); // Assets OData
        //     var oAsset = oCtx.getObject();

        //     if (!this._pQuickView) {
        //         this._pQuickView = Fragment.load({
        //             id: this.getView().getId(),
        //             name: "talentoolui.view.fragments.QuickUserView",
        //             controller: this
        //         }).then((oQuickView) => {
        //             this.getView().addDependent(oQuickView);
        //             return oQuickView;
        //         });
        //     }

        //     this._pQuickView.then((oQuickView) => {
        //         const oQuickViewModel = new sap.ui.model.json.JSONModel({
        //             pages: [{
        //                 pageId: "employeePageId",
        //                 header: "Employee Card",
        //                 title: oAsset.user,   // owner.name projected as user
        //                 description: "Software Engineer"
        //             }]
        //         });

        //         oQuickView.setModel(oQuickViewModel, "QuickView");
        //         oQuickView.openBy(oButton);
        //     });
        // }
        openQuickUserView: function (oEvent) {
            var oButton = oEvent.getSource();
            var oCtx = oButton.getBindingContext(); // Assets OData
            var oAsset = oCtx.getObject();

            if (!this._pQuickView) {
                this._pQuickView = Fragment.load({
                    id: this.getView().getId(),
                    name: "talentoolui.view.fragments.QuickUserView",
                    controller: this
                }).then((oQuickView) => {
                    this.getView().addDependent(oQuickView);
                    return oQuickView;
                });
            }

            this._pQuickView.then((oQuickView) => {
                oQuickView.removeAllPages();

                oQuickView.addPage(new sap.m.QuickViewPage({
                    pageId: "employeePageId",
                    header: "Employee Card",
                    title: oAsset.user,
                    description: "Software Engineer",
                    avatar: new sap.m.Avatar({
                        initials: oAsset.user?.substring(0, 2).toUpperCase(),
                        displaySize: "XL",
                        backgroundColor: "Accent1"
                    }),
                    groups: [
                        new sap.m.QuickViewGroup({
                            heading: "Owner",
                            elements: [
                                new sap.m.QuickViewGroupElement({
                                    label: "Name",
                                    value: oAsset.user
                                })
                            ]
                        })
                    ]
                }));

                oQuickView.openBy(oEvent.getSource());
            });


        },
        onCreateBtnPressed: function () {
            if (!this._oAssignDialog) {
                this._oAssignDialog = sap.ui.xmlfragment(
                    this.getView().getId(),
                    "talentoolui.view.fragments.CreateAsset",
                    this
                );
                this.getView().addDependent(this._oAssignDialog);
            }

            this._oAssignDialog.open();

        },

        onCreateAsset: function () {
            const oView = this.getView();
            const oModel = this.getOwnerComponent().getModel();

            const oListBinding = oModel.bindList("/Assets");

            oListBinding.create({
                assetTag: oView.byId("assetTag").getValue(),
                deviceId: oView.byId("deviceId").getValue(),
                status: oView.byId("status").getSelectedKey(),
            }).created().then(() => {
                sap.m.MessageToast.show("Asset saved");
                this._oAssignDialog.close();
            }).catch((e) => {
                sap.m.MessageToast.show("Error"+ e);
            });
        },


    })
});