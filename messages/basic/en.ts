// ! basic template for the project pre defined components -> no need to change
export default {
    captchaIsRequired: "Please verify reCaptcha",
    buttons: {
        advancedSearch: "Advanced Search",
        moveToPacking: "Move to Packing",
        moveToFinished: "End Order",
        fileOutput: "Download",
        addImage: "Attach Image",
        addLink: "Attach Link",
        imageInfo: "Image guide",
        clearFilters: "Clear Filters",
        loadMore: "Load More",
        nextPage: "Next Page",
        previousPage: "Previous Page",
        previousFolder: "Previous Folder",
        submit: "Submit",
        fileManagement: "File Management",
        searchResult: "Search : {parent}",
        addFile: "Add File",
        createNewFolder: "Create New Folder",
        pasteFile: "Paste File",
        updateFile: "Update File",
        deleteFolder: "Delete Folder",
        deleteFile: "Delete File",
        updateQuote: "Update",
        updateLocaleQuote: "Update Locale",
        log: "history",
        logs: {
            heading: "History",
            title: "Log History",
            description: "Click to track changes to this record over time"
        },
        delete: {
            heading: "Delete",
            title: "Delete Record",
            description: "Click to delete this record"
        }
    },
    
    errorPages: {
        "429": {
            title: "429 - Too Many Requests",
            getTimer: "This page will reload in {timer} seconds",
            redirecting: "Redirecting ..."
        },
        "404": {
            title: "404 - Not Found",
        },
        "500": {
            title: "500 - Internal Server Error",
        },
        "403": {
            title: "500 - Access Denied",
        },
        "record404":{
            title: "No Record Was Found",
        },
        goPreviousPage: "Go To Previous Page"
    },
    table: {
        headings: {
            actions: "actions",
            recordsFound: "{recordsFound} Records Found",
        }
    },
    forms: {
        deleteConfirmation: "i understand",
        general: {
            heading: {
                delete: "WARNING: Deleted data are not retrievable !",
                fileOutput: "WARNING: This function is significantly heavy and may occasionally cause problems !"
            },
            error: {
                required: "This field is required",
                unknown: "Unknown error occurred",
                langIsRequired: "You must specify a language to create a new record",
                maxSizeExceeded: "The maximum size allowed for this field is {maxSize}"
            },
            label: {
                langSelection: "Language to create the record in",
                predefinedImage: "Image",
                selectedFilePreview: "Click to preview selected file",
                selectedTablePreview: "Click to preview selected data",
            },
            placeholder: {
                predefinedImage: "Images are going to be displayed with a width of 100 percent & a height of auto",
            },
            loading: {
                title: "Loading..."
            }
        },
        fileManagement: {
            orderBy: {
                values: {
                    createdAtAcs: "Oldest",
                    createdAtDesc: "Newest",
                    slugAsc: "A - Z",
                    slugDesc: "Z - A",
                }
            },
            deleteFolder: {
                hint: "NOTE: you won't be able to access this folder and all the files included in it after deleting it"
            },
            deleteFile: {
                hint: "NOTE: you won't be able to access this file after deleting it"
            },
            paste: {
                hint: "NOTE: this data will be moved to the chosen location"
            }
        },
        logout: {
            title: "Logout",
            hint: "Are you sure you want to log out?",
            submitButton: "Yes",
        },
        editCarousel: {
            heading: "Carousel Management",
            title: "Update Slide",
            createQuote: "Add new slide",
            deleteQuote: "Delete Slide",
            moveQuote: "Move Slide"
        },
        editBasicFields: {
            heading: "Basic Fields",
            title: "Edit Basic Fields",
            description: "Click to view / edit basic fields"
        },
        editLocalizedFields: {
            heading: "Localized Fields",
            description: "Click to view / edit Localized fields"
        },
        editPassword: {
            title: "Password",
            description: "Click to view / edit password"
        },
        createLocalizedFields: {
            description: "Click to localize the record in this locale"
        },
    }
}