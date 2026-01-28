sap.ui.define(["sap/ui/core/mvc/Controller"], (Controller) => {
    "use strict"
    return Controller.extend("talentoolui.controller.AssetMaintenance", {
        onInit() {
            this.getView().setModel(this.getOwnerComponent().getModel(), "AssetMaintenance");
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

            const oTable = this.byId("MaintenanceRequests");
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
                        path: `title`,
                        operator: sap.ui.model.FilterOperator.Contains,
                        value1: sQuery,
                        caseSensitive: false
                    })
                ];
                const oOrFilter = new sap.ui.model.Filter({
                    filters: aFilters,
                    and: false // OR condition
                });
                oBinding.filter(oOrFilter)
            } else {
                oBinding.filter([]);
            }
        },
        onRequestItemPressed: function (oEvent) {
            const oItem = oEvent.getSource();
            const oCtx = oItem.getBindingContext();
            const sId = oCtx.getProperty("ID");
            this.getOwnerComponent()
                .getRouter()
                .navTo("RouteAssetMaintenanceObject", { id: sId });

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
        reqPriorityState: function (state) {
            switch (state.toUpperCase()) {
                case "HIGH":
                    return "Error";
                case "MID":
                    return "Warning";
                case "LOW":
                    return "Information";
                default:
                    return "Success";
            }
        },
        reqStatusState: function (sStatus) {
            switch (sStatus.toUpperCase()) {
                case "OPEN":
                    return "Error";
                case "INPROGRESS":
                    return "Warning";
                case "FIXED":
                    return "Success";
                default:
                    return "None";
            }
        },
    })
});