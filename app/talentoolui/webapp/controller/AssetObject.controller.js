sap.ui.define(['sap/ui/core/mvc/Controller'],(Controller)=>{
    "use strict";
    return Controller.extend('talentoolui.controller.AssetObject',{
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
                    change: function () {
                        this.byId("edit").setEnabled(true);
                    }.bind(this)
                }
            });
        }
    })
})