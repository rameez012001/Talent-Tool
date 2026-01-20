sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("talentoolui.controller.Header", {
        onInit() {
            
        },
        onGlobalSearch: function (oEvent) {
            const sQuery = oEvent.getSource().getValue();

            sap.ui.getCore().getEventBus().publish(
                "globalSearch",
                "filter",
                { query: sQuery }
            );
        }
    });
});
