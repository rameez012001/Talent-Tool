sap.ui.define(['sap/ui/core/mvc/Controller'],(Controller)=>{
    "use strict";
    return Controller.extend('talentoolui.controller.AssetMaintenanceObject',{
        onInit: function () {
            this.getOwnerComponent()
                .getRouter()
                .getRoute("RouteAssetMaintenanceObject")
                .attachPatternMatched(this._onMatched, this);
                
        },

        _onMatched: function (oEvent) {
            const sId = oEvent.getParameter("arguments").id;

            this.getView().bindElement({
                path: `/MaintenanceRequests('${sId}')`,
                events: {
                    change: function () {
                        this.byId("edit").setEnabled(true);
                    }.bind(this)
                }
            });
        }
    })
})