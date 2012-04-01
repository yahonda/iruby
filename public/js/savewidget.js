//----------------------------------------------------------------------------
//  Copyright (C) 2008-2011  The IPython Development Team
//
//  Distributed under the terms of the BSD License.  The full license is in
//  the file COPYING, distributed as part of this software.
//----------------------------------------------------------------------------

//============================================================================
// SaveWidget
//============================================================================

var IRuby = (function (IRuby) {

    var utils = IRuby.utils;

    var SaveWidget = function (selector) {
        this.selector = selector;
        if (this.selector !== undefined) {
            this.element = $(selector);
            this.style();
            this.bind_events();
        }
    };


    SaveWidget.prototype.style = function () {
        this.element.find('span#save_widget').addClass('ui-widget');
        this.element.find('span#notebook_name').addClass('ui-widget ui-widget-content');
        this.element.find('span#save_status').addClass('ui-widget ui-widget-content')
            .css({border: 'none', 'margin-left': '20px'});
    };


    SaveWidget.prototype.bind_events = function () {
        var that = this;
        this.element.find('span#notebook_name').click(function () {
            that.rename_notebook();
        });
        this.element.find('span#notebook_name').hover(function () {
            $(this).addClass("ui-state-hover");
        }, function () {
            $(this).removeClass("ui-state-hover");
        });
        $([IRuby.events]).on('notebook_loaded.Notebook', function () {
            that.set_last_saved();
            that.update_notebook_name();
            that.update_document_title();
        });
        $([IRuby.events]).on('notebook_saved.Notebook', function () {
            that.set_last_saved();
            that.update_notebook_name();
            that.update_document_title();
        });
        $([IRuby.events]).on('notebook_save_failed.Notebook', function () {
            that.set_save_status('');
        });
    };


    SaveWidget.prototype.rename_notebook = function () {
        var that = this;
        var dialog = $('<div/>');
        dialog.append(
            $('<h3/>').html('Enter a new notebook name:')
            .css({'margin-bottom': '10px'})
        );
        dialog.append(
            $('<input/>').attr('type','text').attr('size','25')
            .addClass('ui-widget ui-widget-content')
            .attr('value',IRuby.notebook.get_notebook_name())
        );
        // $(document).append(dialog);
        dialog.dialog({
            resizable: false,
            modal: true,
            title: "Rename Notebook",
            closeText: "",
            close: function(event, ui) {$(this).dialog('destroy').remove();},
            buttons : {
                "OK": function () {
                    var new_name = $(this).find('input').attr('value');
                    if (!IRuby.notebook.test_notebook_name(new_name)) {
                        $(this).find('h3').html(
                            "Invalid notebook name. Notebook names must "+
                            "have 1 or more characters and can contain any characters " +
                            "except / and \\. Please enter a new notebook name:"
                        );
                    } else {
                        IRuby.notebook.set_notebook_name(new_name);
                        IRuby.notebook.save_notebook();
                        $(this).dialog('close');
                    }
                },
                "Cancel": function () {
                    $(this).dialog('close');
                }
            }
        });
    }


    SaveWidget.prototype.update_notebook_name = function () {
        var nbname = IRuby.notebook.get_notebook_name();
        this.element.find('span#notebook_name').html(nbname);
    };


    SaveWidget.prototype.update_document_title = function () {
        var nbname = IRuby.notebook.get_notebook_name();
        document.title = nbname;
    };


    SaveWidget.prototype.update_url = function () {
        var notebook_id = IRuby.notebook.get_notebook_id();
        if (notebook_id !== null) {
            var new_url = $('body').data('baseProjectUrl') + notebook_id;
            window.history.replaceState({}, '', new_url);
        };
    };


    SaveWidget.prototype.set_save_status = function (msg) {
        this.element.find('span#save_status').html(msg);
    }


    SaveWidget.prototype.set_last_saved = function () {
        var d = new Date();
        this.set_save_status('Last saved: '+d.format('mmm dd h:MM TT'));
    };


    IRuby.SaveWidget = SaveWidget;

    return IRuby;

}(IRuby));
