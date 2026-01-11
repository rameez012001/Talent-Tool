sap.ui.define([ "sap/ui/core/mvc/Controller"],(Controller)=>{
    "use strict"
    return Controller.extend("talentoolui.controller.Assets",{
        onInit(){
            this.getView().setModel(this.getOwnerComponent().getModel(), "Assets");
        },
        onAssetItemPressed: function (oEvent) {
            const oItem = oEvent.getSource();
            const oCtx = oItem.getBindingContext();
            const sId = oCtx.getProperty("ID");
            this.getOwnerComponent()
                .getRouter()
                .navTo("RouteAssetObject", { id: sId });

        },
    })
});