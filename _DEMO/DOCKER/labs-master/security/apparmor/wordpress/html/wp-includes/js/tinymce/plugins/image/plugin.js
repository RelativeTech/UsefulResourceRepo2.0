/**
 * plugin.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2015 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/*global tinymce:true */

tinymce.PluginManager.add("image", function (editor) {
  function getImageSize(url, callback) {
    var img = document.createElement("img");

    function done(width, height) {
      if (img.parentNode) {
        img.parentNode.removeChild(img);
      }

      callback({ width: width, height: height });
    }

    img.onload = function () {
      done(
        Math.max(img.width, img.clientWidth),
        Math.max(img.height, img.clientHeight)
      );
    };

    img.onerror = function () {
      done();
    };

    var style = img.style;
    style.visibility = "hidden";
    style.position = "fixed";
    style.bottom = style.left = 0;
    style.width = style.height = "auto";

    document.body.appendChild(img);
    img.src = url;
  }

  function buildListItems(inputList, itemCallback, startItems) {
    function appendItems(values, output) {
      output = output || [];

      tinymce.each(values, function (item) {
        var menuItem = { text: item.text || item.title };

        if (item.menu) {
          menuItem.menu = appendItems(item.menu);
        } else {
          menuItem.value = item.value;
          itemCallback(menuItem);
        }

        output.push(menuItem);
      });

      return output;
    }

    return appendItems(inputList, startItems || []);
  }

  function createImageList(callback) {
    return function () {
      var imageList = editor.settings.image_list;

      if (typeof imageList == "string") {
        tinymce.util.XHR.send({
          url: imageList,
          success: function (text) {
            callback(tinymce.util.JSON.parse(text));
          },
        });
      } else if (typeof imageList == "function") {
        imageList(callback);
      } else {
        callback(imageList);
      }
    };
  }

  function showDialog(imageList) {
    var win,
      data = {},
      dom = editor.dom,
      imgElm = editor.selection.getNode();
    var width,
      height,
      imageListCtrl,
      classListCtrl,
      imageDimensions = editor.settings.image_dimensions !== false;

    function recalcSize() {
      var widthCtrl, heightCtrl, newWidth, newHeight;

      widthCtrl = win.find("#width")[0];
      heightCtrl = win.find("#height")[0];

      if (!widthCtrl || !heightCtrl) {
        return;
      }

      newWidth = widthCtrl.value();
      newHeight = heightCtrl.value();

      if (
        win.find("#constrain")[0].checked() &&
        width &&
        height &&
        newWidth &&
        newHeight
      ) {
        if (width != newWidth) {
          newHeight = Math.round((newWidth / width) * newHeight);

          if (!isNaN(newHeight)) {
            heightCtrl.value(newHeight);
          }
        } else {
          newWidth = Math.round((newHeight / height) * newWidth);

          if (!isNaN(newWidth)) {
            widthCtrl.value(newWidth);
          }
        }
      }

      width = newWidth;
      height = newHeight;
    }

    function onSubmitForm() {
      function waitLoad(imgElm) {
        function selectImage() {
          imgElm.onload = imgElm.onerror = null;

          if (editor.selection) {
            editor.selection.select(imgElm);
            editor.nodeChanged();
          }
        }

        imgElm.onload = function () {
          if (!data.width && !data.height && imageDimensions) {
            dom.setAttribs(imgElm, {
              width: imgElm.clientWidth,
              height: imgElm.clientHeight,
            });
            //WP
            editor.fire("wpNewImageRefresh", { node: imgElm });
          }

          selectImage();
        };

        imgElm.onerror = selectImage;
      }

      updateStyle();
      recalcSize();

      data = tinymce.extend(data, win.toJSON());
      var caption = data.caption; // WP

      if (!data.alt) {
        data.alt = "";
      }

      if (!data.title) {
        data.title = "";
      }

      if (data.width === "") {
        data.width = null;
      }

      if (data.height === "") {
        data.height = null;
      }

      if (!data.style) {
        data.style = null;
      }

      // Setup new data excluding style properties
      /*eslint dot-notation: 0*/
      data = {
        src: data.src,
        alt: data.alt,
        title: data.title,
        width: data.width,
        height: data.height,
        style: data.style,
        class: data["class"],
      };

      editor.undoManager.transact(function () {
        // WP
        var eventData = { node: imgElm, data: data, caption: caption };

        editor.fire("wpImageFormSubmit", { imgData: eventData });

        if (eventData.cancel) {
          waitLoad(eventData.node);
          return;
        }
        // WP end

        if (!data.src) {
          if (imgElm) {
            dom.remove(imgElm);
            editor.focus();
            editor.nodeChanged();
          }

          return;
        }

        if (data.title === "") {
          data.title = null;
        }

        if (!imgElm) {
          data.id = "__mcenew";
          editor.focus();
          editor.selection.setContent(dom.createHTML("img", data));
          imgElm = dom.get("__mcenew");
          dom.setAttrib(imgElm, "id", null);
        } else {
          dom.setAttribs(imgElm, data);
          editor.editorUpload.uploadImagesAuto();
        }

        waitLoad(imgElm);
      });
    }

    function removePixelSuffix(value) {
      if (value) {
        value = value.replace(/px$/, "");
      }

      return value;
    }

    function srcChange(e) {
      var srcURL,
        prependURL,
        absoluteURLPattern,
        meta = e.meta || {};

      if (imageListCtrl) {
        imageListCtrl.value(editor.convertURL(this.value(), "src"));
      }

      tinymce.each(meta, function (value, key) {
        win.find("#" + key).value(value);
      });

      if (!meta.width && !meta.height) {
        srcURL = editor.convertURL(this.value(), "src");

        // Pattern test the src url and make sure we haven't already prepended the url
        prependURL = editor.settings.image_prepend_url;
        absoluteURLPattern = new RegExp("^(?:[a-z]+:)?//", "i");
        if (
          prependURL &&
          !absoluteURLPattern.test(srcURL) &&
          srcURL.substring(0, prependURL.length) !== prependURL
        ) {
          srcURL = prependURL + srcURL;
        }

        this.value(srcURL);

        getImageSize(
          editor.documentBaseURI.toAbsolute(this.value()),
          function (data) {
            if (data.width && data.height && imageDimensions) {
              width = data.width;
              height = data.height;

              win.find("#width").value(width);
              win.find("#height").value(height);
            }
          }
        );
      }
    }

    width = dom.getAttrib(imgElm, "width");
    height = dom.getAttrib(imgElm, "height");

    if (
      imgElm.nodeName == "IMG" &&
      !imgElm.getAttribute("data-mce-object") &&
      !imgElm.getAttribute("data-mce-placeholder")
    ) {
      data = {
        src: dom.getAttrib(imgElm, "src"),
        alt: dom.getAttrib(imgElm, "alt"),
        title: dom.getAttrib(imgElm, "title"),
        class: dom.getAttrib(imgElm, "class"),
        width: width,
        height: height,
      };

      // WP
      editor.fire("wpLoadImageData", { imgData: { data: data, node: imgElm } });
    } else {
      imgElm = null;
    }

    if (imageList) {
      imageListCtrl = {
        type: "listbox",
        label: "Image list",
        values: buildListItems(
          imageList,
          function (item) {
            item.value = editor.convertURL(item.value || item.url, "src");
          },
          [{ text: "None", value: "" }]
        ),
        value: data.src && editor.convertURL(data.src, "src"),
        onselect: function (e) {
          var altCtrl = win.find("#alt");

          if (
            !altCtrl.value() ||
            (e.lastControl && altCtrl.value() == e.lastControl.text())
          ) {
            altCtrl.value(e.control.text());
          }

          win.find("#src").value(e.control.value()).fire("change");
        },
        onPostRender: function () {
          /*eslint consistent-this: 0*/
          imageListCtrl = this;
        },
      };
    }

    if (editor.settings.image_class_list) {
      classListCtrl = {
        name: "class",
        type: "listbox",
        label: "Class",
        values: buildListItems(
          editor.settings.image_class_list,
          function (item) {
            if (item.value) {
              item.textStyle = function () {
                return editor.formatter.getCssText({
                  inline: "img",
                  classes: [item.value],
                });
              };
            }
          }
        ),
      };
    }

    // General settings shared between simple and advanced dialogs
    var generalFormItems = [
      {
        name: "src",
        type: "filepicker",
        filetype: "image",
        label: "Source",
        autofocus: true,
        onchange: srcChange,
      },
      imageListCtrl,
    ];

    if (editor.settings.image_description !== false) {
      generalFormItems.push({
        name: "alt",
        type: "textbox",
        label: "Image description",
      });
    }

    if (editor.settings.image_title) {
      generalFormItems.push({
        name: "title",
        type: "textbox",
        label: "Image Title",
      });
    }

    if (imageDimensions) {
      generalFormItems.push({
        type: "container",
        label: "Dimensions",
        layout: "flex",
        direction: "row",
        align: "center",
        spacing: 5,
        items: [
          {
            name: "width",
            type: "textbox",
            maxLength: 5,
            size: 3,
            onchange: recalcSize,
            ariaLabel: "Width",
          },
          { type: "label", text: "x" },
          {
            name: "height",
            type: "textbox",
            maxLength: 5,
            size: 3,
            onchange: recalcSize,
            ariaLabel: "Height",
          },
          {
            name: "constrain",
            type: "checkbox",
            checked: true,
            text: "Constrain proportions",
          },
        ],
      });
    }

    generalFormItems.push(classListCtrl);

    // WP
    editor.fire("wpLoadImageForm", { data: generalFormItems });

    function mergeMargins(css) {
      if (css.margin) {
        var splitMargin = css.margin.split(" ");

        switch (splitMargin.length) {
          case 1: //margin: toprightbottomleft;
            css["margin-top"] = css["margin-top"] || splitMargin[0];
            css["margin-right"] = css["margin-right"] || splitMargin[0];
            css["margin-bottom"] = css["margin-bottom"] || splitMargin[0];
            css["margin-left"] = css["margin-left"] || splitMargin[0];
            break;
          case 2: //margin: topbottom rightleft;
            css["margin-top"] = css["margin-top"] || splitMargin[0];
            css["margin-right"] = css["margin-right"] || splitMargin[1];
            css["margin-bottom"] = css["margin-bottom"] || splitMargin[0];
            css["margin-left"] = css["margin-left"] || splitMargin[1];
            break;
          case 3: //margin: top rightleft bottom;
            css["margin-top"] = css["margin-top"] || splitMargin[0];
            css["margin-right"] = css["margin-right"] || splitMargin[1];
            css["margin-bottom"] = css["margin-bottom"] || splitMargin[2];
            css["margin-left"] = css["margin-left"] || splitMargin[1];
            break;
          case 4: //margin: top right bottom left;
            css["margin-top"] = css["margin-top"] || splitMargin[0];
            css["margin-right"] = css["margin-right"] || splitMargin[1];
            css["margin-bottom"] = css["margin-bottom"] || splitMargin[2];
            css["margin-left"] = css["margin-left"] || splitMargin[3];
        }
        delete css.margin;
      }
      return css;
    }

    function updateStyle() {
      function addPixelSuffix(value) {
        if (value.length > 0 && /^[0-9]+$/.test(value)) {
          value += "px";
        }

        return value;
      }

      if (!editor.settings.image_advtab) {
        return;
      }

      var data = win.toJSON(),
        css = dom.parseStyle(data.style);

      css = mergeMargins(css);

      if (data.vspace) {
        css["margin-top"] = css["margin-bottom"] = addPixelSuffix(data.vspace);
      }
      if (data.hspace) {
        css["margin-left"] = css["margin-right"] = addPixelSuffix(data.hspace);
      }
      if (data.border) {
        css["border-width"] = addPixelSuffix(data.border);
      }

      win
        .find("#style")
        .value(dom.serializeStyle(dom.parseStyle(dom.serializeStyle(css))));
    }

    function updateVSpaceHSpaceBorder() {
      if (!editor.settings.image_advtab) {
        return;
      }

      var data = win.toJSON(),
        css = dom.parseStyle(data.style);

      win.find("#vspace").value("");
      win.find("#hspace").value("");

      css = mergeMargins(css);

      //Move opposite equal margins to vspace/hspace field
      if (
        (css["margin-top"] && css["margin-bottom"]) ||
        (css["margin-right"] && css["margin-left"])
      ) {
        if (css["margin-top"] === css["margin-bottom"]) {
          win.find("#vspace").value(removePixelSuffix(css["margin-top"]));
        } else {
          win.find("#vspace").value("");
        }
        if (css["margin-right"] === css["margin-left"]) {
          win.find("#hspace").value(removePixelSuffix(css["margin-right"]));
        } else {
          win.find("#hspace").value("");
        }
      }

      //Move border-width
      if (css["border-width"]) {
        win.find("#border").value(removePixelSuffix(css["border-width"]));
      }

      win
        .find("#style")
        .value(dom.serializeStyle(dom.parseStyle(dom.serializeStyle(css))));
    }

    if (editor.settings.image_advtab) {
      // Parse styles from img
      if (imgElm) {
        if (
          imgElm.style.marginLeft &&
          imgElm.style.marginRight &&
          imgElm.style.marginLeft === imgElm.style.marginRight
        ) {
          data.hspace = removePixelSuffix(imgElm.style.marginLeft);
        }
        if (
          imgElm.style.marginTop &&
          imgElm.style.marginBottom &&
          imgElm.style.marginTop === imgElm.style.marginBottom
        ) {
          data.vspace = removePixelSuffix(imgElm.style.marginTop);
        }
        if (imgElm.style.borderWidth) {
          data.border = removePixelSuffix(imgElm.style.borderWidth);
        }

        data.style = editor.dom.serializeStyle(
          editor.dom.parseStyle(editor.dom.getAttrib(imgElm, "style"))
        );
      }

      // Advanced dialog shows general+advanced tabs
      win = editor.windowManager.open({
        title: "Insert/edit image",
        data: data,
        bodyType: "tabpanel",
        body: [
          {
            title: "General",
            type: "form",
            items: generalFormItems,
          },

          {
            title: "Advanced",
            type: "form",
            pack: "start",
            items: [
              {
                label: "Style",
                name: "style",
                type: "textbox",
                onchange: updateVSpaceHSpaceBorder,
              },
              {
                type: "form",
                layout: "grid",
                packV: "start",
                columns: 2,
                padding: 0,
                alignH: ["left", "right"],
                defaults: {
                  type: "textbox",
                  maxWidth: 50,
                  onchange: updateStyle,
                },
                items: [
                  { label: "Vertical space", name: "vspace" },
                  { label: "Horizontal space", name: "hspace" },
                  { label: "Border", name: "border" },
                ],
              },
            ],
          },
        ],
        onSubmit: onSubmitForm,
      });
    } else {
      // Simple default dialog
      win = editor.windowManager.open({
        title: "Insert/edit image",
        data: data,
        body: generalFormItems,
        onSubmit: onSubmitForm,
      });
    }
  }

  editor.addButton("image", {
    icon: "image",
    tooltip: "Insert/edit image",
    onclick: createImageList(showDialog),
    stateSelector: "img:not([data-mce-object],[data-mce-placeholder])",
  });

  editor.addMenuItem("image", {
    icon: "image",
    text: "Insert/edit image",
    onclick: createImageList(showDialog),
    context: "insert",
    prependToContext: true,
  });

  editor.addCommand("mceImage", createImageList(showDialog));
});
