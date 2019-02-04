/**
 * This function defines the hash of the register that will be deleted.
 * 
 * @param id
 *            The element hash.
 */
function setHashToDelete(id) {
    $("#hashToDelete").val(id);
}

/**
 * This function returns the URL specified as parameter without a final slash if
 * exists one.
 * 
 * @param URL
 *            The URL.
 * @returns The URL specified as parameter without a final slash if exists one.
 */
function removesFinalSlash(URL) {
    if(URL.substr(-1) === '/') {
        return URL.substr(0, URL.length - 1);
    }
    return URL;
}

function getJQueryId(id) {
    if(id.substr(0, 1) !== '#') {
        return '#' + id;
    }
    return id;
}

/**
 * This function returns a DataTable column definition that has the specified
 * name, sorting property, and render.
 * 
 * @param {name:string,sortable:boolean,render:function}
 * @param name
 *            The column name.
 * @param sortable
 *            Whether the column is sortable (default is true).
 * @param searchable
 *            Whether the column is searchable (default is true).
 * @param render
 *            The function that renders the column
 * @returns An object with the column definition.
 */
function getColumnDefinition({
    name,
    sortable = true,
    searchable = true,
    render = function (data, type, row) {
        if('display' === type) {
            return data;
        }
    }
} = {}) {
    return {
        'data' : name,
        'bSearchable' : searchable,
        'bSortable' : sortable,
        'render' : render
    };
}

/**
 * This function returns a DataTable sortable and searchable column definition
 * that has the specified name and render.onRow
 * 
 * @param {name:String,sortable:boolean,render:function}
 * @param name
 *            The column name.
 * @param render
 *            The function that renders the column
 * @returns An object with the column definition.
 */
function getSortableAndSearchableColumnDefinition({
    name,
    render = function (data, type, row) {
        return data;
    }
} = {}) {
    return getColumnDefinition({name: name, render: render});
}

/**
 * This function returns a DataTable non-sortable and searchable column
 * definition that has the specified name and render.
 * 
 * @param {name:String,sortable:boolean,render:function}
 * @param name
 *            The column name.
 * @param render
 *            The function that renders the column
 * @returns An object with the column definition.
 */

function getNonSortableAndSearchableColumnDefinition({
    name,
    render = function (data, type, row) {
        return data;
    }
} = {}) {
    return getColumnDefinition({name: name, sortable: false, render: render});
}

/**
 * This function returns a DataTable non-sortable and non-searchable column
 * definition that has the specified name and render.
 * 
 * @param {name:String,sortable:boolean,render:function}
 * @param name
 *            The column name.
 * @param render
 *            The function that renders the column
 * @returns An object with the column definition.
 */

function getNonSortableAndNonSearchableColumnDefinition({
    name,
    render = function (data, type, row) {
        return data;
    }
} = {}) {
    return getColumnDefinition({name: name, sortable: false, searchable: false, render: render});
}

/**
 * This function returns a DataTable column definition for deleting the
 * register.The delete action sends a request to {baseURL}/delete?hash={id} by
 * default.
 * 
 * @param {baseURL:String,name:String,onDeleteSelected:function}
 */
function getDeleteColumnDefinition({
    baseURL,
    name = "hash",
    onDeleteSelected = (row) => { return '<a href="#" onclick="setHashToDelete(\'' + row[name] + '\');" data-toggle="modal" data-target="#confirmDeletion"><i class="fa fa-trash text-danger fa-2x" aria-hidden="true"></i></a>'; },
    render = function (data, type, row) {
        if ('display' === type) {
            return onDeleteSelected(row);
        }
        return data;
    }
} = {}) {
    return getColumnDefinition({name: name, sortable: false, searchable : false, render: render});
}

/**
 * This function returns a DataTable column definition for updating the
 * register. The update action sends a request to {baseURL}/{id} by default.
 * 
 * @param
 * {baseURL:String,updateURLPattern:String,name:String,onUpdateSelected:Function,render:Function}
 */
function getUpdateColumnDefinition({
    baseURL,
    updateURLPattern = baseURL + "/{id}",
    name = "hash",
    onUpdateSelected = (row) => { return `window.location = '${updateURLPattern.replace("{id}", row[name])}'`; },
    render = function (data, type, row) {
        if ('display' === type) {
            return `<a href="javascript:${onUpdateSelected(row)};" class="text-center"><i class="fa fa-pencil-square-o text-primary fa-2x" aria-hidden="true"></i></a>`;
        }
        return data;
    }
} = {}) {
    return getColumnDefinition({name: name, sortable: false, searchable : false, render: render});
}

/**
 * This function configures a DataTable for a search page.
 * 
 * @param
 * {columns:array,editBaseURL:string,onRowSelectedCallback:function,onRowSelected:function,orderDirection:string,orderIndex:int,tableURL:string,tableId:string}
 * @returns
 */
function configureDatatable({
        baseURL,
        columns,
        name = "hash",
        orderDirection = 'asc',
        orderIndex = 1,
        tableURL = baseURL + "/table",
        data = (dataRepository) => {},
        tableId = '#listTable'
} = {}) {

    let listTable = $(tableId).DataTable({
        'responsive' : true,
        'order' : [ [ orderIndex, orderDirection ] ],
        'paging' : true,
        'sPaginationType' : 'full_numbers',
        'searching' : true,
        'ordering' : true,
        'processing' : true,
        'serverSide' : true,
        'ajax' : {
            'url': tableURL,
            'data' : data
        },
        'language' : {
            'url' : contextPath + 'js/plugins/datatables/pt-br.json'
        },
        'loadingRecords': '&nbsp;',
        'processing': '<div class="spinner"></div>',
        'columns' : columns,
        "iDisplayLength" : 10,
        "aLengthMenu" : [ [ 5, 10, 25, 50, -1 ], [ 5, 10, 25, 50, "Todos" ] ],
        dom : 'Blfrtip',
        buttons : [ {
            extend : 'copy',
            className : 'btn btn-primary fa fa-copy'
        }, {
            extend : 'excel',
            className : 'btn btn-primary fa fa-table'
        }, {
            extend : 'pdf',
            className : 'btn btn-primary fa fa-file'
        }, {
            extend : 'print',
            className : 'btn btn-primary glyphicon glyphicon-print'
        } ]
    });

    return listTable;
}

/**
 * Register the an assynchronous city loading triggered by the selection of a
 * state.
 * 
 * @param stateId
 *            The id of the select that contains the states.
 * @param cityId
 *            The id of the select that contains the cities.
 * @param callback
 *            A callback function that will be called when the operation is
 *            finished.
 */
function registerCityLoadingByState({
    stateId = "#state", 
    cityId = "#city", 
    successCallback = () => {},
    errorCallback = (result) => {}
} = {}) {
    stateId = getJQueryId(stateId);
    cityId = getJQueryId(cityId);

    $(getJQueryId(stateId)).on('change', function() {
        loadCitiesByState({
            stateId: stateId,
            cityId: cityId,
            successCallback: successCallback,
            errorCallback: errorCallback
        })
    });
}

function loadCitiesByState({
    stateId = "#state", 
    cityId = "#city", 
    successCallback = () => {},
    errorCallback = (result) => {}
} = {}) {
    stateId = getJQueryId(stateId);
    cityId = getJQueryId(cityId);
    
    showLoadingAlert();
    $.ajax({
        url : contextPath + "states/" + $(stateId).val() + "/cities", type : 'get', success : function(result) {
        $(cityId).find("option:not(:first-of-type)").remove();
        $.each(result, function(index, city) {
            var option = new Option(city.name, city.hashString);
            $(option).html(city.name);
            $(cityId).append(option);
        });
        $(cityId).trigger('change');
        
        hideLoadingAlert();
        
        if (successCallback) {
            successCallback();
        }
        
        }, error : function(result) {
            hideLoadingAlert();
            
            if (errorCallback) {
                errorCallback(result);
            }
            
        }
    });
}

function registerCEPSearching({
    zipCodeId = '#zipCode',
    stateId = '#state',
    cityId = '#city',
    neighborhoodId = '#neighborhood',
    addressId = '#place',
    complementId = '#complement',
    successCallback = () => {},
    errorCallback = () => {}
    } = {}) {
    
    zipCodeId = getJQueryId(zipCodeId);
    stateId = getJQueryId(stateId);
    cityId = getJQueryId(cityId);
    neighborhoodId = getJQueryId(neighborhoodId);
    addressId = getJQueryId(addressId);
    complementId = getJQueryId(complementId);

    $(zipCodeId).on('focusout', function() {
        
        showLoadingAlert();
        
        $.ajax({
            url : 'https://viacep.com.br/ws/' + $(zipCodeId).val().replace('-', '') + '/json/', type : 'get', 
            success : function(result) {
                
                var $initialField = $(':focus');
                
                $(stateId).val($(getJQueryId(stateId) + " option[data-acronym='" + result.uf + "']").val());
                $(stateId).trigger('change');
                $(stateId).focus();
                loadCitiesByState({
                    stateId: stateId,
                    cityId: cityId,
                    successCallback: function() {
                        $(cityId + " option").each(function() {
                            if (result.localidade === $(this).html()) {
                                $(cityId).val($(this).val());                                
                                $(neighborhoodId).val(result.bairro);
                                $(neighborhoodId).focus();
                                $(addressId).val(result.logradouro);
                                $(addressId).focus();
                                $(complementId).val(result.complemento);
                                $(complementId).focus();
                                return;
                            }
                        });
                    }
                });
                
                if(successCallback) {
                    successCallback();
                }

                hideLoadingAlert();
                
            }, 
            error : function(result) {
                hideLoadingAlert();
                if(errorCallback) {
                    errorCallback();
                }
            }
        });
    });
}

function registerImagePreview({
    imageId = '#image',
    imagePreviewId = '#imagePreview',
    callbackWhenNotAnImage = () => { alert('Por favor, selecione uma imagem.'); } 
    } = {}) {
    imageId = getJQueryId(imageId);
    imagePreviewId = getJQueryId(imagePreviewId);
    $(imageId).on(
            'change',
            function () {
                var files = !!this.files ? this.files : [];
                if (!files.length || !window.FileReader)
                    return;

                if (/^image/.test(files[0].type)) { // Allow only image upload.
                    var ReaderObj = new FileReader(); // Create instance of
                    // FileReader
                    ReaderObj.readAsDataURL(files[0]); // Read the file.
                    ReaderObj.onloadend = function () {
                        $(imagePreviewId).css('background-image',
                                'url("' + this.result + '")')
                    }
                } else {
                    
                }
            });

    $(imagePreviewId).on('click', function () {
        $(imageId).trigger('click');
    });
}

function setFormValidation({
    formId = '#form',
    rules,
    messages
} = {}) {
    jQuery.extend(jQuery.validator.messages, {
        required: "Este dado é obrigatório",
    });

    // Define the form validation.
    return $(getJQueryId(formId)).validate(
            {
                errorClass : "state-error",
                validClass : "state-success",
                errorElement : "em",

                rules : rules,

                /*
                 * @validation error messages
                 * ----------------------------------------------
                 */

                messages : messages,

                /*
                 * @validation highlighting + error placement
                 * ----------------------------------------------------
                 */

                highlight : function (element, errorClass, validClass) {
                    $(element).closest('.field').addClass(errorClass)
                            .removeClass(validClass);
                },
                unhighlight : function (element, errorClass, validClass) {
                    $(element).closest('.field').removeClass(errorClass)
                            .addClass(validClass);
                },
                errorPlacement : function (error, element) {
                    if (element.is(":radio") || element.is(":checkbox")) {
                        element.closest('.option-group').after(error);
                    } else {
                        error.insertAfter(element.parent());
                    }
                }

            });
}

function setDatePicker({
    fieldId,
    format = 'dd/mm/yy'
} = {}) {
    $(getJQueryId(fieldId))
    .datepicker(
            {
                dateFormat: format,
                prevText : '<i class="fa fa-chevron-left"></i>',
                nextText : '<i class="fa fa-chevron-right"></i>',
                showButtonPanel : false,
                beforeShow : function (
                        input, inst) {
                    var newclass = 'allcp-form';
                    var themeClass = $(this)
                            .parents(
                                    '.allcp-form')
                            .attr('class');
                    var smartpikr = inst.dpDiv
                            .parent();
                    if (!smartpikr
                            .hasClass(themeClass)) {
                        inst.dpDiv
                                .wrap('<div class="' + themeClass + '"></div>');
                    }
                },
                dateFormat: 'dd/mm/yy',
                dayNames: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'],
                dayNamesMin: ['D','S','T','Q','Q','S','S','D'],
                dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb','Dom'],
                monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
                monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'],
                nextText: '>',
                prevText: '<'
            });

}

function showLoadingAlert() {
    $(".loader-backdrop").fadeIn('normal');
}

function hideLoadingAlert() {
    $(".loader-backdrop").fadeOut('normal');
}

(function ($) {
    $(document).ready(function () {

        // Open a select 2 when it receive focus.
        jQuery(document).on('focus', '.select2', function () {
            jQuery(this).siblings('select').select2('open');
        });
        
    });
})(jQuery);
