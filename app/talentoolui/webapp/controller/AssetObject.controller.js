sap.ui.define(['sap/ui/core/mvc/Controller', "sap/ui/model/json/JSONModel"], (Controller, JSONModel) => {
    "use strict";
    return Controller.extend('talentoolui.controller.AssetObject', {
        onInit: function () {
            this.getOwnerComponent()
                .getRouter()
                .getRoute("RouteAssetObject")
                .attachPatternMatched(this._onMatched, this);
        },

        _onMatched: function (oEvent) {
            const sId = oEvent.getParameter("arguments").id;

            this.getView().bindElement({
                path: `/Assets('${sId}')`,
                events: {
                    dataReceived: this._onAssetLoaded.bind(this)
                },
                parameters: {
                    $expand: "owner"
                },
            });
        },

        _onAssetLoaded: function () {
            let oContext = this.getView().getBindingContext();
            let sStatus = oContext.getProperty("status");
            let sOwner = oContext.getProperty("owner/ID");
            if (sStatus == "MAINTENANCE") {
                this.byId('rasieRequest').setEnabled(false)
            }
            if (sOwner) {
                this.byId('assignEmployee').setEnabled(false)
            }
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
        openUserDialog: function () {
            if (!this._oAssignDialog) {
                this._oAssignDialog = sap.ui.xmlfragment(
                    this.getView().getId(),
                    "talentoolui.view.fragments.AssignUserDialog",
                    this
                );
                this.getView().addDependent(this._oAssignDialog);
            }
            const oAssignUserModel = new JSONModel({
                title: "Assign Employee"
            })
            this._oAssignDialog.setModel(oAssignUserModel,"assignUser")
            this._oAssignDialog.open();
        },
        handleAssignConfirm: function () {
            let sUserId = this.byId("assignUserSelect").getSelectedKey();
            if (!sUserId) {
                sap.m.MessageToast.show("Please select a user");
                return;
            }

            let oView = this.getView();
            let oModel = oView.getModel();
            let oContext = oView.getBindingContext();

            oContext.setProperty("owner_ID", sUserId);
            oContext.setProperty("status", "IN_USE");
            oContext.setProperty(
                "assignedOn",
                new sap.ui.model.odata.type.Date().parseValue(
                    new Date(),
                    "object"
                )
            );

            oModel.submitBatch("auto").then(function () {
                sap.m.MessageToast.show("Employee assigned");
            }).catch(function () {
                sap.m.MessageToast.show("Assignment failed");
            });
            this._oAssignDialog.close();
            oModel.refresh(true);
        },

        onCloseDialog: function () {
            if (this._oAssignDialog) {
                this._oAssignDialog.close();
            } if (this._oOpenReqDialog) {
                this._oOpenReqDialog.close();
            }
        },

        openReqDialog: function () {
            if (!this._oOpenReqDialog) {
                this._oOpenReqDialog = sap.ui.xmlfragment(
                    this.getView().getId(),
                    "talentoolui.view.fragments.CreateRequest",
                    this
                );
                this.getView().addDependent(this._oOpenReqDialog);
            }

            this._oOpenReqDialog.open();
        },

        onRaiseRequest: function () {
            let oView = this.getView();
            let oModel = oView.getModel();

            let oAssetContext = oView.getBindingContext();
            let sAssetId = oAssetContext.getProperty("ID");
            let sOwner = oAssetContext.getProperty("owner/ID");

            if (!sAssetId) {
                sap.m.MessageToast.show("Asset not loaded");
                return;
            }

            let sTitle = this.byId("reqTitle").getValue();
            let sDesc = this.byId("reqDesc").getValue();
            let sPriority = this.byId("reqPriority").getSelectedKey();
            let sTechnicianId = this.byId("assignTechnicianSelect").getSelectedKey();

            let oPayload = {
                title: sTitle,
                description: sDesc,
                priority: sPriority,
                asset_ID: sAssetId
            };

            if (sTechnicianId) {
                oPayload.technician_ID = sTechnicianId;
                oPayload.status= "INPROGRESS";
            }

            let oListBinding = oModel.bindList("/MaintenanceRequests");

            oListBinding.create(oPayload);
            oAssetContext.setProperty('status', 'MAINTENANCE')
            if(sOwner){
                alert("im working fine")
                oAssetContext.setProperty(
                    "returnedOn",
                    new sap.ui.model.odata.type.Date().parseValue(
                    new Date(),
                    "object"
                    )
                );
                console.log(oAssetContext.getProperty("returnedOn"))
            }

            oModel.submitBatch("$auto")
                .then(function () {
                    sap.m.MessageToast.show("Maintenance request created");
                })
                .catch(function () {
                    sap.m.MessageToast.show("Failed to create request");
                });

            this._oOpenReqDialog.close();
            oModel.refresh(true);
        }

    })
})