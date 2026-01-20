sap.ui.define(["sap/ui/core/mvc/Controller"], (Controller) => {
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
    })
});