// ****************************************************************************
//
// DataTable-related functions.
//
// ****************************************************************************

/**
 * Return a DataTable column definition that has the specified name, sorting and
 * searching property, and render.
 * 
 * @param name
 *            The column name.
 * @param sortable
 *            Whether the column is sortable (default is true).
 * @param searchable
 *            Whether the column is searchable (default is true).
 * @param render
 *            The function that renders the columns.
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
    if(!isString(name) || 0 === name.length) {
        throw "The column name must be a non-empty String.";
    }
    
    return {
        'data' : name,
        'bSearchable' : searchable,
        'bSortable' : sortable,
        'render' : render
    };
}

/**
 * Return a DataTable sortable and searchable column definition that has the
 * specified name and render.onRow
 * 
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
 * Return a DataTable sortable and non-searchable column definition that has the
 * specified name and render.onRow
 * 
 * @param name
 *            The column name.
 * @param render
 *            The function that renders the column
 * @returns An object with the column definition.
 */
function getSortableAndNonSearchableColumnDefinition({
    name,
    render = function (data, type, row) {
        return data;
    }
} = {}) {
    return getColumnDefinition({name: name, render: render, searchable: false});
}


/**
 * Return a DataTable non-sortable and searchable column definition that has the
 * specified name and render.
 * 
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
 * Return a DataTable non-sortable and non-searchable column definition that has
 * the specified name and render.
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
 * Return a DataTable column definition for deleting a register. The delete
 * action sends a request to {baseURL}/delete?hash={id} by default.
 * 
 * @param {baseURL:String,name:String,onDeleteSelected:function}
 */
function getDeleteColumnDefinition({
    baseURL,
    name = "hash",
    onDeleteSelected = (row) => { return `<a href="#" onclick="javascript:setHashToDelete({hash: '${row[name]}'});" data-toggle="modal" data-target="#confirmDeletion"><i class="fa fa-trash text-danger fa-2x" aria-hidden="true"></i></a>`; },
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
 * Return a DataTable column definition for updating the register. The update
 * action sends a request to {baseURL}/{id} by default.
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
 * Configure a DataTable for a search page.
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

    if(!isString(tableURL) || 0 === tableURL.length) {
        throw 'The table URL must be a non-empty String.';
    }
    
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
 * Store the hash of the register that will be deleted after confirmation. It is
 * used to store the value in a confirmation modal input hidden, for example.
 * 
 * @param hash
 *            The element hash.
 */
function setHashToDelete({
    deleteElementInputName = "#hashToDelete",
    hash
} = {}) {
	deleteElementInputName = getIdSelector(deleteElementInputName);
    let $inputHidden = $(deleteElementInputName);
    
    if(0 == $inputHidden.length) {
        throw `Error:  no input type hidden with id ${formId}`;
    }    
    
    $inputHidden.val(hash);
}    


/**
 * Register an asynchronous city loading triggered by the selection of a state.
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
    stateId = getIdSelector(stateId);
    cityId = getIdSelector(cityId);

    $(getIdSelector(stateId)).on('change', function() {
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
    stateId = getIdSelector(stateId);
    cityId = getIdSelector(cityId);
    
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
    
    zipCodeId = getIdSelector(zipCodeId);
    stateId = getIdSelector(stateId);
    cityId = getIdSelector(cityId);
    neighborhoodId = getIdSelector(neighborhoodId);
    addressId = getIdSelector(addressId);
    complementId = getIdSelector(complementId);

    $(zipCodeId).on('focusout', function() {
        
        showLoadingAlert();
        
        $.ajax({
            url : 'https://viacep.com.br/ws/' + $(zipCodeId).val().replace('-', '') + '/json/', type : 'get', 
            success : function(result) {
                
                var $initialField = $(':focus');
                
                $(stateId).val($(getIdSelector(stateId) + " option[data-acronym='" + result.uf + "']").val());
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

    imageId = getIdSelector(imageId);
    imagePreviewId = getIdSelector(imagePreviewId);
    
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
    return $(getIdSelector(formId)).validate(
            {
                ignore: [], // Allow the validation of input type hidden fields
                            // (for select2).
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
    format = 'dd/mm/yyyy'
} = {}) {
    $(getIdSelector(fieldId))
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
                dayNames: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'],
                dayNamesMin: ['D','S','T','Q','Q','S','S','D'],
                dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb','Dom'],
                monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
                monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'],
                nextText: '>',
                prevText: '<'
            });

}

function processCheckboxValue({
    checkboxId,
    targetId,
    inverse = true,
    callback
} = {}) {
    
    checkboxId = getIdSelector(checkboxId);
    targetId = getIdSelector(targetId);
    
    let $checkbox = $(checkboxId);
    if(inverse) {
    	callback( checkboxId, targetId, $checkbox.is(':checked') );
    } else {
    	callback( checkboxId, targetId, !$checkbox.is(':checked') );
    }
}

function configureCheckboxToggle({
    checkboxId,
    targetId,
    inverse = true,
    callback = (checkboxId, targetId, toggle) => { $(targetId).prop("disabled", toggle) }
} = {}) {

    // A) Inverse:
    // * When checkbox is checked, target is disabled.
    // * When checkbox is NOT checked, target is enabled.
    // B) Direct:
    // * When checkbox is checked, target is enabled.
    // * When checkbox is NOT checked, target is disabled.

    processCheckboxValue({checkboxId: checkboxId, targetId: targetId, inverse: inverse, callback});
    
    $(checkboxId).on('change', function() {
        processCheckboxValue({checkboxId: checkboxId, targetId: targetId, inverse: inverse, callback});
    });

}

(function ($) {
    $(document).ready(function () {

        // Open a select 2 when it receive focus.
        jQuery(document).on('focus', '.select2', function () {
            jQuery(this).siblings('select').select2('open');
        });
        
    });
})(jQuery);

// ****************************************************************************
//
// Loading-related functions.
//
// ****************************************************************************

/**
 * Show a loading alert.
 */
function showLoadingAlert() {
    $(".loader-backdrop").fadeIn('normal');
}

/**
 * Hide the loading alert.
 */
function hideLoadingAlert() {
    $(".loader-backdrop").fadeOut('normal');
}

// ****************************************************************************
//
// Configure subform modal.
//
// ****************************************************************************

/**
 * Configure a subform shown in a modal and whose data is displayed in a table.
 */
function configureSubForm({
    formId = '#form',
    subFormId,
    subFormModalId,
    subFormElementNamePrefix = "",
    beforeAddingCallback = () => { return true; },
    subFormAddButtonId,
    afterAddingCallback = () => {
        
        let hasModal = false;
        if(isString(subFormModalId) && subFormModalId.length > 0) {
            subFormModalId = getIdSelector(subFormModalId);
            hasModal = true;
        }
                
        if(hasModal) {
            let $subFormModal = $(subFormModalId);
            $subFormModal.modal('toggle');
        }
        
        subFormId = getIdSelector(subFormId);
        let $subForm = $(subFormId);

        $subForm.trigger('reset');
        $subForm.validate().resetForm();   

    },
    showAddingSubFormModalButtonId,
    isSubFormDeletable = true,
    subFormDeleteHashStorageId,
    subFormDeleteConfirmationModalId,
    subFormDeleteConfirmationModalDeleteButtonId,
    subFormDeletedElementInputName = "hashesToDelete",
    subFormUpdatedElementInputName = "hashesToUpdate",
    isSubFormUpdatable = true,
    subFormUpdateHashStorageId,
    beforeUpdatingCallback = () => { return true; },
    subFormUpdateButtonId,
    afterUpdatingCallback = () => {},
    formHiddenContainerId = '#hiddenContainer',
    tableId,
    tableDataGenerators,
    tableRowGenerator = (dataId, isDataServerSide) => { return defaultTableRowGenerator({
        tableDataGenerators: tableDataGenerators,
        isSubFormDeletable: isSubFormDeletable,
        subFormDeleteHashStorageId: subFormDeleteHashStorageId,
        subFormDeleteConfirmationModalId: subFormDeleteConfirmationModalId,
        isSubFormUpdatable: isSubFormUpdatable,
        subFormAddButtonId: subFormAddButtonId,
        subFormUpdateButtonId: subFormUpdateButtonId,
        subFormUpdateHashStorageId: subFormUpdateHashStorageId,
        subFormDeletedElementInputName: subFormDeletedElementInputName,
        dataId: dataId,
        subFormModalId: subFormModalId,
        subFormId: subFormId, 
        isDataServerSide: isDataServerSide}); }
} = {}) {

    formId = getIdSelector(formId);
    subFormId = getIdSelector(subFormId);
    if(isString(subFormModalId) && subFormModalId.length > 0) {
        subFormModalId = getIdSelector(subFormModalId);
    }
    subFormAddButtonId = getIdSelector(subFormAddButtonId);
    if(isSubFormDeletable) {
        subFormDeleteConfirmationModalId = getIdSelector(subFormDeleteConfirmationModalId);
        subFormDeleteHashStorageId = getIdSelector(subFormDeleteHashStorageId);
        subFormDeleteConfirmationModalDeleteButtonId = getIdSelector(subFormDeleteConfirmationModalDeleteButtonId);
    }
    if(isSubFormUpdatable) {
        subFormUpdateHashStorageId = getIdSelector(subFormUpdateHashStorageId);
        subFormUpdateButtonId = getIdSelector(subFormUpdateButtonId);
    }
    formHiddenContainerId = getIdSelector(formHiddenContainerId);
    tableId = getIdSelector(tableId);
    showAddingSubFormModalButtonId = getIdSelector(showAddingSubFormModalButtonId);
    
    let $form = $(formId);
    let $subForm = $(subFormId);
    let $subFormModal = $(subFormModalId);
    let $subFormAddButton = $(subFormAddButtonId);
    let $subFormDeleteConfirmationModal = $(subFormDeleteConfirmationModalId);
    let $subFormDeleteHashStorage = $(subFormDeleteHashStorageId);
    let $subFormDeleteConfirmationModalDeleteButton = $(subFormDeleteConfirmationModalDeleteButtonId);
    let $subFormUpdateHashStorage = $(subFormUpdateHashStorageId);
    let $subFormUpdateButton = $(subFormUpdateButtonId);
    let $formHiddenContainer = $(formHiddenContainerId);
    let $tableId = $(tableId);
    let $showAddingSubFormModalButton = $(showAddingSubFormModalButtonId);
    
    if(0 === $form.length) {
        throw `Error: there is no form with id ${formId}`;
    }
    if(0 === $subForm.length) {
        throw `Error: there is no subform with id ${subFormId}`;
    }
    if(0 === $subFormAddButton.length) {
        throw `Error: there is no subform add button with id ${subFormAddButtonId}`;
    }
    if(isSubFormDeletable) {
        if(0 === $subFormDeleteConfirmationModal.length) {
            throw `Error: there is no subform delete confirmation modal with id ${subFormDeleteConfirmationModalId}`;
        }
        if(0 === $subFormDeleteConfirmationModalDeleteButton.length) {
            throw `Error: there is no subform delete button with id ${subFormDeleteConfirmationModalDeleteButtonId}`;
        }
        if(0 === $subFormDeleteHashStorage.length) {
            throw `Error: there is no subform delete hash storage with id ${subFormDeleteHashStorageId}`;
        }
    }
    if(isSubFormUpdatable) {
        if(0 === $subFormUpdateButton.length) {
            throw `Error: there is no subform update button with id ${subFormUpdateButtonId}`;
        }
        if(0 === $subFormUpdateHashStorage.length) {
            throw `Error: there is no subform update storage with id ${subFormUpdateHashStorageId}`;
        }
    }
    if(0 === $formHiddenContainer.length) {
        throw `Error: there is no hidden container with id ${formHiddenContainerId}`;
    }
    if(0 === $tableId.length) {
        throw `Error: there is no table with id ${tableId}`;
    }
    if (!subFormElementNamePrefix) {
    	throw `Error: there is no element prefix. Are you sure you aren't forgetting it?`;
    }
    
    $showAddingSubFormModalButton.on('click', function() {
        $subFormModal.modal('show');
        $subFormUpdateButton.hide();
        $subFormAddButton.show();
    });
    
    function addNew({insertAfterId}={}) {
        //
        // Clone the subform, add an identifier attribute to it, add the subform
        // serialized data as an input type hidden, add a table row to the
        // subform-related table, and add it to the hidden container.
        //
        
        let randomID = UUID.generate();
        
        let serializedSubForm = $subForm.serialize();
        
        const inputs = $subForm.serializeArray().map(({ name, value }) => {
        	let inputName = `${subFormElementNamePrefix}[INDEX].${name}`; 
        	const index = countSameNameHiddenInputs(inputName);
        	inputName = inputName.replace("INDEX", index);
        	return `<input type="hidden" name="${inputName}" value="${value}" />`;
        });
        
        // Create a container to store all subform data.
        let $newSubFormContainer = jQuery('<div/>', { 'data-luqueid': randomID, 'style' : 'display: none' });
        $newSubFormContainer.append(inputs);

        $newSubFormContainer.append($(`<input type="hidden" data-luqueid='${randomID}'>`).attr({
            name: 'serializedSubForm',
            value: serializedSubForm
        }));
        
        $formHiddenContainer.append($newSubFormContainer);
        
        // Generate a table row for the subform data.
        let row = tableRowGenerator(randomID, false);
        if(isNotEmptyString(insertAfterId)) {
            let $insertAfter = $(`tr[data-luqueid='${insertAfterId}']`);
            if(0 == $insertAfter.length) {
                throw `Error: there is no element with id ${insertAfterId}`;
            }
            
            $insertAfter.after(row);            
        } else {
            $tableId.append(row);
        }
    }
    
    // Register the click event to the subform add button.
    $subFormAddButton.on('click', function() {
        if(!beforeAddingCallback()) {
            return;
        }
        
        addNew();
        
        if(afterAddingCallback) {
            afterAddingCallback();
        }
    });

    if(isSubFormUpdatable) {
        // Register the click event to the subform update button.
        $subFormUpdateButton.on('click', function() {
            if(!beforeUpdatingCallback()) {
                return;
            }
            
            let currentDataId = $subFormUpdateHashStorage.val();
            let $currentTableRow = $(`table tr[data-luqueid='${currentDataId}']`);
            addNew({insertAfterId: currentDataId});
            
            // Remove the existing data.
            removeSubFormRegistry({
            	dataId: currentDataId, 
            	subFormDeletedElementInputName, 
            	subFormDeleteHashStorageId,
            	subFormUpdatedElementInputName,
            	formHiddenContainerId,
            	isUpdating: true
        	});
            
            if(afterUpdatingCallback) {
                afterUpdatingCallback();
            }
            
            $subFormModal.modal('hide');
        });
    }
    
    if(isSubFormDeletable) {
        $subFormDeleteConfirmationModalDeleteButton.on('click', function() {
            removeSubFormRegistry({
            	dataId: $subFormDeleteHashStorage.val(), 
            	subFormDeletedElementInputName, 
            	subFormDeleteHashStorageId, 
            	formHiddenContainerId,
            	subFormUpdatedElementInputName,
            	isDeleting: true
        	});
        });
    }
    
    $(document).ready(function() {
        loadServerSideSubFormRegistries({
        	formHiddenContainerId, subFormId, tableRowGenerator, tableId
        }); 
    });
}

/**
 * Load the subform registries data that came from the server and create a table
 * row for each.
 */
function loadServerSideSubFormRegistries({
    formHiddenContainerId,
    subFormId,
    tableRowGenerator,
    tableId
} = {}) {

    // Pre-processing and validation.
    formHiddenContainerId = getIdSelector(formHiddenContainerId);
    $formHiddenContainer = $(formHiddenContainerId);
    if(0 === $formHiddenContainer.length) {
        throw `Error: there is no hidden container with id ${formHiddenContainerId}`;
    }

    subFormId = getIdSelector(subFormId);
    $subForm = $(subFormId);
    if(0 === $subForm.length) {
        throw `Error: there is no subform with id ${subFormId}`;
    }

    $formHiddenContainer.children('[data-luqueid]').each(function() {
        let luqueId = $(this).data('luqueid');
        loadSubFormData({dataId: luqueId, subFormId});
        let row = tableRowGenerator(luqueId, true);
        $(tableId).append(row);
    });
}

function editSubFormRegistry({
    dataId,
    subFormAddButtonId,
    subFormId,
    subFormUpdateButtonId,
    subFormUpdateHashStorageId
} = {}) {
    // Show the update button and hide the add one.
    subFormAddButtonId = getIdSelector(subFormAddButtonId);
    let $subFormAddButton = $(subFormAddButtonId);
    subFormUpdateButtonId = getIdSelector(subFormUpdateButtonId);
    let $subFormUpdateButton = $(subFormUpdateButtonId);
    subFormUpdateHashStorageId = getIdSelector(subFormUpdateHashStorageId);
    let $subFormUpdateHashStorage = $(subFormUpdateHashStorageId);
    
    $subFormAddButton.hide();
    $subFormUpdateButton.show();
    
    $subFormUpdateHashStorage.val(dataId);
    
    loadSubFormData({dataId: dataId, subFormId: subFormId});
}

/**
 * Load the data from a hidden div container into a form using the
 * jquery-deserialize library.
 * 
 * @param subFormId
 *            The id of the subform.
 * @param dataId
 *            The id of the hidden div container.
 */
function loadSubFormData({
    dataId,
    subFormId
} = {}) {
    
    subFormId = getIdSelector(subFormId);

    // It uses the plugin jquery-deserialize:
    // https://github.com/kflorence/jquery-deserialize.
    $(subFormId).deserialize(JSON.parse($(`input[data-luqueid='${dataId}']`).val()));
}

function getFormData({
    fieldId} = {}) {
    
    fieldId = getIdSelector(fieldId);
    
    let $field = $(fieldId);
    
    if(0 === $field.length) {
        throw `Error: there is no field with id ${fieldId}`;
    }
    
    switch($field.prop("tagName").toUpperCase()) {
        case 'INPUT':
            let type = $field.attr('type');
            if('CHECKBOX' === type.toUpperCase()) {
                return $field.prop(":checked") ? 'Sim' : 'Não';
            } else {
                return $field.val();
            }
            break;
        case 'TEXTAREA':
            return $field.val();
            break;
        case 'SELECT':
            return $field.children("option:selected").text();
            break;
        default:
            return "";
    }
}

/**
 * Remove the subform registry with the specified data id.
 * 
 * @param dataId
 *            The id of the registry data must be removed.
 */
function removeSubFormRegistry({
    dataId,
    subFormDeleteHashStorageId,
    subFormDeletedElementInputName,
    subFormUpdatedElementInputName,
    formHiddenContainerId,
    isDeleting,
    isUpdating
} = {}) {
    const $row = $(`[data-luqueid='${dataId}']`);
    if ($row.length) {
    	const isDataServerSide = $row.filter('tr').data('serverSide');
    	
    	if (isDataServerSide) {
    		const subFormElement = JSON.parse($(`input[name=serializedSubForm][data-luqueid=${dataId}]`).first().val());
            
        	if (isDeleting) {
            	let inputName = `${subFormDeletedElementInputName}[INDEX]`;
        		const index = countSameNameHiddenInputs(inputName);
        		inputName = inputName.replace("INDEX", index);
        		
            	const input = `<input type="hidden" name="${inputName}" value="${subFormElement.hashString}" data-luqueid='${dataId}' />`;
            	$(formHiddenContainerId).append(input);
        	}
        	
        	if (isUpdating) {
            	let inputName = `${subFormUpdatedElementInputName}[INDEX]`;
        		const index = countSameNameHiddenInputs(inputName);
        		inputName = inputName.replace("INDEX", index);
        		
            	const input = `<input type="hidden" name="${inputName}" value="${subFormElement.hashString}" data-luqueid='${dataId}' />`;
            	$(formHiddenContainerId).append(input);
        	}
    	}
    	
    	$row.remove();
    }
}

/**
 * Generate a table row based on the specified collection of table data
 * generators. Each table data generator is a function that returns the data for
 * a specific column.
 * 
 * @param tableDataGenerators
 *            A collection of table data generator functions.
 * @returns A string containing the table row.
 */
function defaultTableRowGenerator({
    tableDataGenerators,
    isSubFormDeletable,
    subFormAddButtonId,
    subFormUpdateButtonId,
    subFormDeleteHashStorageId,
    subFormDeleteConfirmationModalId,
    subFormDeletedElementInputName,
    subFormUpdateHashStorageId,
    isSubFormUpdatable,
    dataId,
    subFormModalId,
    subFormId,
    isDataServerSide
} = {}) {
    const dataServerSide = isDataServerSide ? " data-server-side='true'" : "";
    
    let row = `<tr data-luqueid='${dataId}'${dataServerSide}>`;
    if(isSubFormUpdatable) {
        if(isNotEmptyString(subFormModalId)) {
            subFormModalId = getIdSelector(subFormModalId);
        }
        $subFormModal = $(subFormModalId);
        if($subFormModal.length == 0) {
            row += `<td><a href="#" onclick="javascript:editSubFormRegistry({subFormUpdateHashStorageId: '${subFormUpdateHashStorageId}', subFormAddButtonId: '${subFormAddButtonId}', subFormUpdateButtonId: '${subFormUpdateButtonId}', subFormId: '${subFormId}', dataId: '${dataId}'});" class="text-center"><i class="fa fa-pencil-square-o text-primary fa-2x" aria-hidden="true"></i></a></td>`;
        } else {
            row += `<td><a href="#" onclick="javascript:editSubFormRegistry({subFormUpdateHashStorageId: '${subFormUpdateHashStorageId}', subFormAddButtonId: '${subFormAddButtonId}', subFormUpdateButtonId: '${subFormUpdateButtonId}', subFormId: '${subFormId}', dataId: '${dataId}'});" class="text-center" data-toggle="modal" data-target="${subFormModalId}"><i class="fa fa-pencil-square-o text-primary fa-2x" aria-hidden="true"></i></a></td>`;
        }
    }
    if(tableDataGenerators && tableDataGenerators.length > 0) {
        tableDataGenerators.forEach(function(currentValue, i, array) {
            row += "<td>" + currentValue() + "</td>";
        }, this);
    }
    if(isSubFormDeletable) {
        row += `<td><a href="#" onclick="javascript:setHashToDelete({deleteElementInputName: '${subFormDeleteHashStorageId}', hash: '${dataId}'});" data-toggle="modal" data-target="${subFormDeleteConfirmationModalId}"><i class="fa fa-trash text-danger fa-2x" aria-hidden="true"></i></a></td>`;
    }
    return row;
}

// ****************************************************************************
//
// General utility functions.
//
// ****************************************************************************

function countSameNameHiddenInputs(name) {
	if (-1 === name.indexOf("[")) {
		return $(`input[type=hidden][name='${name}']`).length || 0; 
	}
	
	// Name refers to a input array
	const prefix = name.substring(0, name.indexOf("[")) || "";
	const suffix = name.substring(name.lastIndexOf("]") + 1) || "";
	return $(`input[type=hidden][name^="${prefix}"]${suffix ? '[name$=\"' + suffix + '\"]' : ''} `).length || 0;
}

/**
 * Fast UUID generator, RFC4122 version 4 compliant.
 * 
 * @author Jeff Ward (jcward.com).
 * @license MIT license
 * @link http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/21963136#21963136
 */
var UUID = (function() {
  var self = {};
  var lut = []; for (var i=0; i<256; i++) { lut[i] = (i<16?'0':'')+(i).toString(16); }

  self.generate = function() {
    var d0 = Math.random()*0xffffffff|0;
    var d1 = Math.random()*0xffffffff|0;
    var d2 = Math.random()*0xffffffff|0;
    var d3 = Math.random()*0xffffffff|0;
    return lut[d0&0xff]+lut[d0>>8&0xff]+lut[d0>>16&0xff]+lut[d0>>24&0xff]+'-'+
      lut[d1&0xff]+lut[d1>>8&0xff]+'-'+lut[d1>>16&0x0f|0x40]+lut[d1>>24&0xff]+'-'+
      lut[d2&0x3f|0x80]+lut[d2>>8&0xff]+'-'+lut[d2>>16&0xff]+lut[d2>>24&0xff]+
      lut[d3&0xff]+lut[d3>>8&0xff]+lut[d3>>16&0xff]+lut[d3>>24&0xff];
  }
  return self;
  
})();

/**
 * Check whether a parameter is a String.
 * 
 * @param val
 *            The parameter.
 * @returns true, if it is a String. false, otherwise.
 */
function isString(val) {
    return (typeof val === 'string' || val instanceof String);
}

/**
 * Check whether a parameter is a non-empty String.
 * 
 * @param val
 *            The parameter.
 * @returns true, if it is a non-empty String. false, otherwise.
 */
function isNotEmptyString(val) {
    return (typeof val === 'string' || val instanceof String) && $.trim(val).length > 0;
}
/**
 * This function returns the URL specified as parameter without a final slash if
 * it has one
 * 
 * @param URL
 *            The URL.
 * @returns The URL specified as parameter without a final slash if it has one.
 */
function removeFinalSlash({URL} = {}) {
    if(!isString(URL) || 0 === URL.length) {
        throw 'The URL informed to removeFinalSlash must be a non-empty String.';
    }
    
    if('/' === URL.substr(-1)) {
        return URL.substr(0, URL.length - 1);
    }
    return URL;
}


/**
 * Add a # to the beginning of the specified id selector if it does not have
 * one.
 * 
 * @param id
 *            An element id selector.
 * @returns The element id select with a preceding #.
 */
function getIdSelector(id) {
    if(!isString(id) || 0 === id.length) {
        console.log('Error!');
        throw "The id informed to getIdSelector must be a non-empty String.";
    }

    if(id.substr(0, 1) !== '#') {
        return '#' + id;
    }
    return id;
}