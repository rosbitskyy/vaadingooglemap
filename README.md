Vaadin: Google map
===============

Дополнение к Vaadin: Google map autocomplete

## Vaadin Usage
        
        class MyApp extends UI {
            ...
            public MyApp(){
            
                public TextField address = new TextField();
                private VerticalLayout layout = new VerticalLayout();
                ...
                GoogleMap.addComponent(layout);
                ...
                address.setInputPrompt("Укажите адрес");
                address.setWidth("100%");
                address.setImmediate(true);
                address.setId("address");           // назначаем id для DOM елемента строки адреса для автокомплита
                address.addFocusListener(new FieldEvents.FocusListener() {
                    @Override
                    void focus(FieldEvents.FocusEvent focusEvent) {
                        addressFocused();
                    }
                });
                layout.addComponent(address);
                GoogleMap.init();
                ...
                setContent(layout);
            }
        }
        

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
