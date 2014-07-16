/*
 * Copyright (c) 2013 Руслан Розбицкий
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

package ua.pp.rrs.common;

import com.vaadin.shared.ui.label.ContentMode;
import com.vaadin.ui.AbstractLayout;
import com.vaadin.ui.JavaScript;
import com.vaadin.ui.Label;

/**
 * Created by Ruslan Rosbitskyy on 16.07.14.
 * rosbitskyy@gmail.com
 */
public class GoogleMap {

    public static void load(String callback) {
        JavaScript.getCurrent().execute("" +
                "var script = document.createElement('script');" +
                "script.type = 'text/javascript';" +
                "script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=places,geometry&sensor=false&language=ru&callback=" + callback + "';" +
                "document.body.appendChild(script);" +
                "");
        JavaScript.getCurrent().execute("" +
                "var script = document.createElement('script');" +
                "script.type = 'text/javascript';" +
                "script.src = 'https://github.com/rosbitskyy/vaadingooglemap/blob/master/map.js';" +
                "document.body.appendChild(script);" +
                "");
    }

    public static void init() {
        String mapid = "mavpa";
        clearAutocomplete();
        JavaScript.getCurrent().execute("(app.map = new Map('" + mapid + "'))" +
                ".setAutocomplete('address').useShortAddresses(true);");
        clearAutocomplete();
    }

    public static void init(String mapid) {
        clearAutocomplete();
        JavaScript.getCurrent().execute("(app.map = new Map('" + mapid + "'))" +
                ".setAutocomplete('address').useShortAddresses(true);");
        clearAutocomplete();
    }

    public static void addComponent(String mapid) {
        JavaScript.getCurrent().execute("if (document.getElementById('" + mapid + "') == null) {" +
                "var div = document.createElement('div');" +
                "div.id = '" + mapid + "';" +
                "div.style.display = 'none';" +
                "div.style.width = 0;" +
                "div.style.height = 0;" +
                "document.body.appendChild(div);" +
                "}");
    }

    public static void appendChild(String elementId, String mapid) {
        JavaScript.getCurrent().execute("if (document.getElementById('" + elementId + "') != null){" +
                "if (document.getElementById('" + mapid + "') == null) {" +
                "var div = document.createElement('div');" +
                "div.id = '" + mapid + "';" +
//                "div.style.display = 'none';" +
                "div.style.width = '100%';" +
                "div.style.height = '100%';" +
                "document.getElementById('" + elementId + "').appendChild(div);" +
                "}}");
    }

    public static void addComponent(AbstractLayout layout) {
        Label lbl = new Label("<div id='mavpa' style='width: 0; height: 0; display: none;'><div>", ContentMode.HTML);
        lbl.setSizeUndefined();
        layout.addComponent(lbl);
    }

    public static void clearAutocomplete() {
        JavaScript.getCurrent().execute("try{var childs = document.getElementsByClassName('pac-container');" +
                "for(i=0;i<childs.length;i++){childs[i].style.zIndex='20000';}}catch(e){}");
    }
}
