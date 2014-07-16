Vaadin: Google map
===============

Дополнение к Vaadin: Google map

## JS Usage

    (app.map = new Map("mavpa"))
                .setAutocomplete("inputaddressElementId")
                .useShortAddresses(true)
                .getAutocomplete(0).onchange =
                function () {
                    app.task(function () {
                        $("#" + app.map.getAutocomplete(0).element).val(app.map.getPlace(0).name);
                    }, 500);
                };
