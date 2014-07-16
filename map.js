/*
 * Copyright (c) 2013 Руслан Розбицкий, Вадим Полищук, Дмитрий Волк
 *
 * Данная лицензия разрешает лицам, получившим копию данного программного
 * обеспечения и сопутствующей документации (в дальнейшем именуемыми «Программное Обеспечение»),
 * безвозмездно использовать Программное Обеспечение без ограничений,
 * включая неограниченное право на использование, копирование, изменение, добавление, публикацию,
 * распространение, сублицензирование и/или продажу копий Программного Обеспечения,
 * также как и лицам, которым предоставляется данное Программное Обеспечение,
 * при соблюдении следующих условий:
 *
 * Указанное выше уведомление об авторском праве и данные условия должны
 * быть включены во все копии или значимые части данного Программного Обеспечения.
 * Кроме содержимого в этом уведомлении, имя(имена) вышеуказанных держателей
 * авторских прав не должно быть использовано в рекламе или иным способом,
 * чтобы увеличивать продажу, использование или другие работы в этом
 * Программном обеспечении без предшествующего письменного разрешения.
 *
 * ДАННОЕ ПРОГРАММНОЕ ОБЕСПЕЧЕНИЕ ПРЕДОСТАВЛЯЕТСЯ «КАК ЕСТЬ», БЕЗ КАКИХ-ЛИБО ГАРАНТИЙ,
 * ЯВНО ВЫРАЖЕННЫХ ИЛИ ПОДРАЗУМЕВАЕМЫХ, ВКЛЮЧАЯ, НО НЕ ОГРАНИЧИВАЯСЬ ГАРАНТИЯМИ
 * ТОВАРНОЙ ПРИГОДНОСТИ, СООТВЕТСТВИЯ ПО ЕГО КОНКРЕТНОМУ НАЗНАЧЕНИЮ И ОТСУТСТВИЯ
 * НАРУШЕНИЙ ПРАВ. НИ В КАКОМ СЛУЧАЕ АВТОРЫ ИЛИ ПРАВООБЛАДАТЕЛИ НЕ НЕСУТ
 * ОТВЕТСТВЕННОСТИ ПО ИСКАМ О ВОЗМЕЩЕНИИ УЩЕРБА, УБЫТКОВ ИЛИ ДРУГИХ ТРЕБОВАНИЙ ПО
 * ДЕЙСТВУЮЩИМ КОНТРАКТАМ, ДЕЛИКТАМ ИЛИ ИНОМУ, ВОЗНИКШИМ ИЗ, ИМЕЮЩИМ ПРИЧИНОЙ ИЛИ
 * СВЯЗАННЫМ С ПРОГРАММНЫМ ОБЕСПЕЧЕНИЕМ ИЛИ ИСПОЛЬЗОВАНИЕМ ПРОГРАММНОГО ОБЕСПЕЧЕНИЯ
 * ИЛИ ИНЫМИ ДЕЙСТВИЯМИ С ПРОГРАММНЫМ ОБЕСПЕЧЕНИЕМ.
 *
 * mailto:support@rrs.pp.ua
 */

if (typeof app == 'undefined') {
    window.app = {debug: false};
}

function Map(elementId) {

    // local
    var map = null;
    var city = "Москва";
    var that = this;
    var place = []; // geo fixer
    var api = "https://maps.googleapis.com/maps/api";

    // public
    this.PLACE_NOSUBWAY = "Нет метро";

    this.directionsRenderer = null; // where we'll do it
    this.directionsDisplay = null; // where we'll do it
    this.directionsService = null; // how we'll do it
    this.placesService = null; // geo points locator
    this.trafficLayer = null;
    this.s = null; // geo points locator
    this.geocoder = null; // mas tur bator :)
    this.autocomplete = []; // bred ot google
    this.zoom = 12; // have are nice kind, we like it
    this.radius = 3000; // because tak nada

    // methods
    this.init = function (elementId) {
        var element = elementId;
        if (typeof google.maps.Map != "function"
            && document.getElementById(elementId) != null) {
            if (app.debug)console.log("error: google.maps services was not inicialized...");
            return this;
        }

        var mapOptions = {
            zoom: this.zoom,
            center: new google.maps.LatLng(55.76, 37.64),
            mapTypeControl: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            country: "ru"
        };
        map = new google.maps.Map(document.getElementById(elementId), mapOptions);

        var rendererOptions = {
            draggable: true,
            editable: true,
            polylineOptions: {
                strokeColor: "red",
                strokeWeight: 5,
                strokeOpacity: 0.7
            },
            map: map
        };
        this.directionsRenderer = this.directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
        this.directionsService = new google.maps.DirectionsService();

        this.geocoder = new google.maps.Geocoder();
        this.placesService = new google.maps.places.PlacesService(map);
        this.s = new google.maps.places.AutocompleteService();
        this.trafficLayer = new google.maps.TrafficLayer();
        this.trafficLayer.setMap(map);
        this.setCity();
        if (app.debug)console.log("initialized google.maps services for element " + elementId);
        return this;
    };

    this.setCenter = function (currcity) {
        if (typeof this.geocoder != "object") return this;
        this.geocoder.geocode({ 'address': currcity}, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (app.debug)console.log("initialized map center for element " + currcity);
                map.setCenter(results[0].geometry.location);
            }
        });
        return this;
    };

    this.route = {
        get: function () { // @params: [optional - waypoints[]], callback
            var waypoints, callback;
            if (arguments.length == 2) {
                waypoints = arguments[0];
                callback = arguments[1];
            } else {
                callback = arguments[0];
                waypoints = [];
                for (var ii = 0; ii < place.length; ii++) {
                    if (that.getPlace(ii) == null) return;
                    var wp = {
                        latitude: that.getPlace(ii).geometry.location.lat(),
                        longitude: that.getPlace(ii).geometry.location.lng()
                    };
                    waypoints.push(wp);
                }
            }

            if (waypoints.length < 2) {
                return this;
            }

            var startPoint = new google.maps.LatLng(waypoints[0].latitude, waypoints[0].longitude);
            var endPoint = new google.maps.LatLng(
                waypoints[waypoints.length - 1].latitude, waypoints[waypoints.length - 1].longitude);
            var wayPoints = [];

            if (waypoints.length > 2) {
                for (var i = 1; i < waypoints.length - 1; i++) {
                    wayPoints.push({
                        location: new google.maps.LatLng(waypoints[i].latitude, waypoints[i].longitude),
                        stopover: true
                    });
                }
            }
            if (app.debug)console.group("Map direction service");
            that.directionsService.route({
                origin: startPoint,
                destination: endPoint,
                travelMode: google.maps.TravelMode.DRIVING,
                durationInTraffic: true,
                waypoints: wayPoints,
                optimizeWaypoints: false,
                provideRouteAlternatives: false, // we need only ONE result
                avoidHighways: true,
                avoidTolls: true
            }, function (response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    that.directionsDisplay.directions = response;
                    that.directionsDisplay.setOptions({
                        suppressMarkers: true,
                        preserveViewport: false
                    });
                    that.directionsDisplay.setMap(map); // not move map data

                    callback(response);
                    if (app.debug)console.groupEnd();
                }
            });
            return this;
        },
        clear: function () {
            that.directionsRenderer.setDirections({routes: []});
            return this;
        },
        show: function () {
            that.directionsRenderer.setMap(map);
        },
        parent: function () {
            return that;
        },
        data: {
            distance: 0, duration: 0
        },
        setData: function (result) {
            var distance = 0, duration = 0;
            var myroute = result.routes[0];
            for (i = 0; i < myroute.legs.length; i++) {
                distance += myroute.legs[i].distance.value;
                duration += myroute.legs[i].duration.value;
            }
            that.route.data.distance = Math.round(distance / 100) / 10;
            that.route.data.duration = Math.round(duration / 60);
        }
    };

    this.refresh = function () {
        return this.setCity();
    };

    this.getCity = function () {
        return city;
    }

    this.setCity = function () {
        if (arguments.length > 0) {
            this.setCenter(city = arguments[0]).setZoom();
        } else {
            this.setCenter(city).setZoom();
        }
        for (var i = 0; i < this.autocomplete.length; i++) {
            this.getAutocomplete(i).object.bindTo('bounds', map);
        }
        return this;
    };

    this.setZoom = function () {
        var int = this.zoom;
        if (arguments.length > 0) int = arguments[0];
        if (map != null) map.setZoom(int);
        return this;
    };

    this.getAutocomplete = function (idx) {
        if (idx > this.autocomplete.length) return null;
        return this.autocomplete[idx];
    };

    this.setAutocomplete = function (element) {
        var input = document.getElementById(element);
        if (input == null) {
            if (app.debug)console.log("error: initializing autocomplete for " + element);
            return this;
        }
        // если не выбрали элемент - эмулируем нажатие стрелки вниз и ENTER
        // сохраняем предыдущие листенеры
        var _addEventListener = (input.addEventListener) ? input.addEventListener : input.attachEvent;

        function addEventListenerWrapper(type, listener) {
            if (type == "keydown") {
                var orig_listener = listener;
                listener = function (event) {
                    if (event.which == 13 || event.keyCode == 13) {
                        var suggestion_selected = $(".pac-item.pac-item-selected").length > 0; //https://developers.google.com/maps/documentation/javascript/places-autocomplete?hl=uk
                        if (!suggestion_selected) {
                            var simulated_downarrow = $.Event("keydown", { // эмулируем коды
                                keyCode: 40,
                                which: 40
                            });
                            orig_listener.apply(input, [simulated_downarrow]); // применяем эмулятор
                        }
                    }
                    orig_listener.apply(input, [event]); // передаем оригинал
                };
            }
            _addEventListener.apply(input, [type, listener]); // добавляем новые к старым
        }

        input.addEventListener = addEventListenerWrapper;
        input.attachEvent = addEventListenerWrapper;
        // сам автокомплит
        var options = {
            language: 'ru',
            componentRestrictions: {country: 'ru'}
        };
        var autocomplete = new google.maps.places.Autocomplete(input, options);
        var i = this.autocomplete.push({
            object: autocomplete,       // сам автокомплит
            element: element,           // id элемент поля ввода
            onchange: function () {     // abstract функция после выполнения автокомплита
            }                           // -- реализовать в UI
        }) - 1;
        autocomplete.setTypes([]);      // ограничение поиска - все типы адресов
        google.maps.event.addListener(this.getAutocomplete(i).object, 'place_changed', function () {
            that.setPlace(i, that.getAutocomplete(i).object.getPlace());
            if (that.getPlace(i).geometry) {
                that.setSubway(i).getAutocomplete(i).onchange();
            }
        });

        if (app.debug)console.log("initialized autocomplete for " + input);
        return this;
    };

    var isShortAddresses = false;
    this.useShortAddresses = function (b) {
        isShortAddresses = b;
        return this;
    };

    this.getMap = function () {
        return map;
    };

    this.parent = function () {
        return this;
    };

    this.clear = function () {
        this.marker.clear();
        this.route.clear();
        this.setCity();
    };

    this.marker = {
        zoomin: false,
        markers: [],
        animate: function (idx, a) {
            if (!!this.markers[idx]) {
                this.markers[idx].setAnimation(a);
            }
            return this;
        },
        add: function (place, image, callback) {
            var marker = new google.maps.Marker({
                position: place.geometry.location,
                map: map,
                title: place.name,
                icon: image,
                draggable: (callback != null),
                animation: google.maps.Animation.DROP //BOUNCE
            });
            var idx = -1;
            if (arguments.length == 4) {
                this.markers[(idx = arguments[3])] = marker;
            } else {
                idx = this.markers.push(marker) - 1;
            }
            if (callback != null) {
                google.maps.event.addListener(this.markers[idx], 'dragend', function (event) {
                    callback(event, idx);
                });
                google.maps.event.addListener(this.markers[idx], 'click', function () {
                    if (that.marker.zoomin) {
                        if (that.marker.markers.length == 2) {
                            that.marker.fit();
                        } else if (that.marker.markers.length == 1) {
                            map.setCenter(that.marker.markers[idx].getPosition());
                            map.setZoom(12);
                        }
                        that.marker.zoomin = false;
                    } else {
                        map.setCenter(that.marker.markers[idx].getPosition());
                        map.setZoom(16);
                        that.marker.zoomin = true;
                    }

                });
            }
            return this;
        },
        clear: function () {
            for (var i = 0; i < this.markers.length; i++) {
                this.markers[i].setMap(null);
            }
            this.markers = [];
            return this;
        },
        show: function () {
            if (this.markers.length < 1)return this;
            for (var i = 0; i < this.markers.length; i++) {
                this.markers[i].setMap(map);
            }
            return this;
        },
        fit: function () {
            var a = this.markers;
            if (arguments.length == 1 && typeof arguments[0] == "object") {
                a = arguments[0];
            }
            var bounds = new google.maps.LatLngBounds();
            for (var i = 0, LtLgLen = a.length; i < LtLgLen; i++) {
                if (!!a[i])
                    bounds.extend(a[i].position);
            }
            map.fitBounds(bounds);
            return this;
        },
        del: function (idx) {
            try {
                this.markers[idx].setMap(null);
                if (this.markers.length - 1 > idx) { // 0 1
                    this.markers[idx] = null;
                } else {
                    this.markers.remove(idx);
                }
            } catch (e) {
            }
            return this;
        },
        update: function (idx, icon, dropcallback) {
            if (!!this.markers[idx]) {
                this.markers[idx].setPosition(that.getPlace(idx).geometry.location);
            } else {
                if (!!that.getPlace(idx))
                    this
                        .add(
                        that.getPlace(idx),
                        icon,
                        dropcallback, idx
                    );
            }
            return this;
        },
        drop: function (e, idx, callback) { // reset address place for drag
            var address = e.latLng.lat() + "+" + e.latLng.lng();
            that.updatePlace(idx, function (idx) {
                app.task(function () {
                    callback();
                }, 100);
            }, address);

        },
        parent: function () {
            return that;
        }
    };

    this.setMarker = function (place) { // well by depricated
        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);
        }
        this.marker.add(place);
        return this;
    }

    this.setSubway = function (idx) {
        if (!that.getPlace(idx)) return this;
        this.placesService.nearbySearch({
            radius: that.radius,
            location: that.getPlace(idx).geometry.location,
            types: ['subway_station']
        }, function (results, status) {
            that.setNearbySubway(idx, results, status);
        });
        return this;
    }

    this.setNearbySubway = function (idx, results, status) {
        var maxdistance = this.radius;
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
                var distance = google.maps.geometry.spherical.computeDistanceBetween(
                    that.getPlace(idx).geometry.location, results[i].geometry.location);
                if (distance < maxdistance) {
                    maxdistance = distance;
                    that.getPlace(idx).subway = results[i].name;
                }
            }
            if (typeof that.getPlace(idx).subway == "undefined") {
                that.getPlace(idx).subway = that.PLACE_NOSUBWAY;
            }
        } else {
            that.getPlace(idx).subway = that.PLACE_NOSUBWAY;
        }
        if (app.debug)console.log(that.getPlace(idx).name + " near " + that.getPlace(idx).subway);
        return this;
    }

    this.setPlace = function (idx, cplace) {
        place[idx] = cplace;
        return this;
    }
    this.getPlace = function (idx) {
        var rv = null;
        if (idx < place.length) {
            rv = place[idx];
            if (rv) {
                rv.lat = rv.geometry.location.lat();
                rv.lon = rv.geometry.location.lng();
                rv.routetype = String(this.getWayPointType(rv));
                rv.routedesc = this.getWayPointTypeName(rv.routetype);
            }
        }
        return rv;
    }
    this.clearPlace = function () {
        for (var i = 0; i < place.length; i++) {
            this.setPlace(i, null);
        }
        return this;
    }
    this.getWayPointType = function (place) {
        var rv = -1;
        try {
            if (place != null) {
                // если в адресе есть аэропорт или слово из названия аэропортов - это аэропорт

                for (var i = 0; i < this.availableAeropuerto.length; i++) {
                    if (place.name.toLowerCase().indexOf(this.availableAeropuerto[i].toLowerCase()) > -1) {
                        rv = 3;
                        break;
                    }
                }
                if (rv < 0) {
                    for (var i = 0; i < this.availableEstacion.length; i++) {
                        if (place.name.toLowerCase().indexOf(this.availableEstacion[i].toLowerCase()) > -1) {
                            rv = 2;
                            break;
                        }
                    }
                }

                if (rv < 0) {
                    var type = place.types[0];
                    if (place.address_components.length > 2 // загородняя поездка
                        && place.address_components[3].long_name.replace("город ", "") != city) {
                        place.name = place.formatted_address.split(",").slice(0, 3).join(",");
                        rv = 4;
                    } else if (type == 'subway_station' || type == 'street_address') { // город
                        rv = 1;
                    } else if (type == 'train_station'
                        && place.subway != this.PLACE_NOSUBWAY) { // вокзал
                        rv = 2;
                    } else if ((type == 'establishment!!!!!!!' && place.subway != this.PLACE_NOSUBWAY)
                        || type == 'airport') { // аэропуэрто
                        rv = 3; //airopuerto
                    } else {
                        rv = 1;
                    }
                }
            }
        } catch (e) {
            rv = 1; // jopa happend
        }
        return rv;
    };
    this.getWayPointTypeName = function (id) {
        switch (id * 1) {
            case 1:
                return "Город";
            case 2:
                return "Вокзал";
            case 3:
                return "Аэропорт";
            case 4:
                return "Загород";
            default:
                return "Город";
        }
        return "Город";
    };

    this.availableEstacion = [ "Белорусский", "Казанский", "Киевский", "Курский", "Ленинградский", "Павелецкий", "Речной", "Рижский", "Савеловский", "Щелковский авто", "Ярославский", "Морской"];
    this.availableAeropuerto = ["Московский Аэропорт Внуково", "Международный Аэропорт Внуково", "Внуково Международный Аэропорт", "Аэропорт Внуково", "Внуково-3", "Аэропорт Домодедово", "Московский аэропорт Домодедово", "Международный аэропорт Домодедово", "Аэропорт Шереметьево", "Московский Аэропорт Шереметьево", "Международный Аэропорт Шереметьево", "Шереметьево, терминал 1(B)", "Шереметьево, терминал 2(F)", "Шереметьево, терминал 3(D)", "Шереметьево, терминал C", "Шереметьево, терминал E", "Пулково", "Пулково-1", "Пулково-2", "Пулково-3"];

    this.init(elementId);
    if (typeof [].remove == "undefined") {
        Array.prototype.remove = function (a, b) {
            var rest = this.slice((b || a) + 1 || this.length);
            this.length = a < 0 ? this.length + a : a;
            return this.push.apply(this, rest);
        };
    }

    this.patchAddress = function (address) {
        var p = {};
        p['комсомольская площадь'] = "Ленинградский вокзал";
        p['россия, московская область, москва, домодедово, аэропорт'] = "Аэропорт Домодедово";
        p['шереметьево'] = "Аэропорт Шереметьево";
        p['смоленская'] = "метро Смоленская";
        p['ям'] = "село Ям";
        p['москва белорусская'] = "Белорусский вокзал";
        p['россия, город москва, москва, верхняя красносельская улица'] = "улица Лобачика";
        p['улица лобачика'] = "Верхняя Красносельская улица";
        p['пулково'] = "Аэропорт Пулково";
        p['пулково-1'] = "Аэропорт Пулково-1";
        p['пулково-2'] = "Аэропорт Пулково-2";
        p['aeroport pulkovo-1'] = "Аэропорт Пулково-1";
        p['aeroport pulkovo-2'] = "Аэропорт Пулково-2";
        p['aeroport pulkovo'] = "Аэропорт Пулково";
        p['vdnkh'] = "ВДНХ";
        p['sheremetyevo international airport'] = "Аэропорт Шереметьево";
        p['moscow domodedovo airport'] = "Аэропорт Домодедово";
        p['vnukovo airport'] = "Аэропорт Внуково";
        p['kiyevskiy vokzal'] = "Киевский вокзал";
        p['yaroslavskiy vokzal'] = "Ярославский вокзал";
        p['leningradskiy vokzal'] = "Ленинградский вокзал";
        p['sankt-peterburg-viteb.'] = "Витебский вокзал";
        p['moskovskiy vokzal'] = "Московский вокзал";
        p['просп. просвецения'] = "просп. Просвещения";
        p[''] = '';
        var r = p[address.toLowerCase()];
        return (typeof r != "undefined") ? r : address;
    }

}
