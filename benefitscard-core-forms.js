/**
 * Register an asynchronous service category loading feature triggered by the
 * selection of a service area.
 * 
 * @param serviceAreaId
 *            The id of the select that contains the service areas.
 * @param serviceCategoryId
 *            The id of the select that contains the service categories.
 * @param successCallback
 *            A callback function that will be called when the operation is
 *            successfully finished.
 * @param errorCallback
 *            A callback function that will be called when the operation
 *            presents an error.
 */
function registerServiceCategoryLoadingByServiceArea({
    serviceAreaId = '#serviceArea',
    serviceCategoryId = '#serviceCategory',
    successCallback = () => {},
    errorCallback = (result) => {}
} = {}) {
    serviceAreaId = getJQueryId(serviceAreaId);
    serviceCategoryId = getJQueryId(serviceCategoryId);
    
    $(serviceAreaId).on(
            'change',
            function () {
                showLoadingAlert();

                $.ajax({
                    url : contextPath + "serviceAreas/"
                            + $(serviceAreaId).val() + "/serviceCategories",
                    type : 'get',
                    success : function (result) {
                        $(serviceCategoryId).find("option:not(:first-of-type)").remove();
                        $.each(result, function (index, serviceCategory) {
                            var option = new Option(serviceCategory.name,
                                    serviceCategory.hashString);
                            $(option).html(serviceCategory.name);
                            $(serviceCategoryId).append(option);
                        });
                        $(serviceCategoryId).trigger('change');
                        
                        hideLoadingAlert();
                        
                        if (successCallback) {
                            successCallback();
                        }
                    },
                    error : function (result) {
                        hideLoadingAlert();
                        
                        if(errorCallback) {
                            errorCallback(result);
                        }
                    }
                });
            });
}

/**
 * Register an asynchronous service loading feature triggered by the selection
 * of a service category.
 * 
 * @param serviceCategoryId
 *            The id of the select that contains the service categories.
 * @param serviceId
 *            The id of the select that contains the services.
 * @param successCallback
 *            A callback function that will be called when the operation is
 *            successfully finished.
 * @param errorCallback
 *            A callback function that will be called when the operation
 *            presents an error.
 */
function registerServiceLoadingByServiceCategory({
    serviceCategoryId = '#serviceCategory',
    serviceId = '#service',
    successCallback = () => {},
    errorCallback = (result) => {}
} = {}) {
    serviceCategoryId = getJQueryId(serviceCategoryId);
    serviceId = getJQueryId(serviceId);
    
    $(serviceCategoryId).on(
            'change',
            function () {
                showLoadingAlert();

                $.ajax({
                    url : contextPath + "serviceCategories/"
                            + $(serviceCategoryId).val() + "/services",
                    type : 'get',
                    success : function (result) {
                        $(serviceId).find("option:not(:first-of-type)").remove();
                        $.each(result, function (index, service) {
                            var option = new Option(service.name,
                                    service.hashString);
                            $(option).html(service.name);
                            $(serviceId).append(option);
                        });
                        
                        hideLoadingAlert();
                        
                        if (successCallback) {
                            successCallback();
                        }
                    },
                    error : function (result) {
                        hideLoadingAlert();
                        
                        if(errorCallback) {
                            errorCallback(result);
                        }
                    }
                });
            });
}

(function ($) {
    $(document).ready(function () {

        // Show how many remaining characters are available in each field.
        $('input[maxlength]').maxlength({
            alwaysShow : true,
            placement : "bottom-right-inside"
        });

    });
})(jQuery);