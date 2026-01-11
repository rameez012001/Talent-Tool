sap.ui.define([ "sap/ui/core/mvc/Controller"],(Controller)=>{
    "use strict"
    return Controller.extend("talentoolui.controller.AssetMaintenance",{
        onInit(){
            this.getView().setModel(this.getOwnerComponent().getModel(),"AssetMaintenance");
        },
        onRequestItemPressed: function (oEvent) {
            const oItem = oEvent.getSource();
            const oCtx = oItem.getBindingContext();
            const sId = oCtx.getProperty("ID");
            this.getOwnerComponent()
                .getRouter()
                .navTo("RouteAssetMaintenanceObject", { id: sId });

        },
    })
});