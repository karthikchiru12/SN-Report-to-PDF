function printReportWindow(reportWindow) {
    console.log("Report is loaded");
    reportWindow.print();
    reportWindow.onafterprint = reportWindow.close;
}

function printReportAfterLoading(reportWindow) {
    if (reportWindow.document.querySelector('#chart-container-builder') === null) {
        printReportWindow(reportWindow);
        return;
    }

    var waitTillReportLoads = setInterval(function () {
        if (reportWindow.document.querySelector('#chart-container-builder').innerHTML.includes('Loading report...')) {
            console.log("Report is still loading");
            return;
        }

        printReportWindow(reportWindow);
        clearInterval(waitTillReportLoads);
    }, 1000);
}

function exportPdf(currentWindow, currentUrl) {
    var waitTillBtnLoads = setInterval(function() {
        if(!currentWindow.document.getElementById("export-to-pdf-button")){
            return;
        }

        currentWindow.document.getElementById("export-to-pdf-button").parentElement.innerHTML = '<a id="export-to-pdf-button" data-original-title="Export to PDF">Export to PDF</a>';
        currentWindow.document.getElementById("export-to-pdf-button").parentElement.addEventListener('click', function () {
            console.log(currentUrl);
            var reportWindow = window.open(currentUrl + "&sysparm_media=print");
            reportWindow.addEventListener('load', function () {
                printReportAfterLoading(reportWindow);
            });
        });
        clearInterval(waitTillBtnLoads);
    }, 1000);
}

var waitTillUrlChanges = this.setInterval(function () {
    var currentUrl = decodeURIComponent(window.location.href);

    if (currentUrl.includes('sys_report_template.do') && currentUrl.includes('jvar_report_id') && !currentUrl.includes("&sysparm_media=print")) {
        clearInterval(waitTillUrlChanges);
      	
        var currentWindow = window;
      	var gsftFrame = document.querySelector("#gsft_main");
        
      	if (gsftFrame) {
      		currentWindow = gsftFrame.contentWindow;
              currentUrl = currentUrl.replace('nav_to.do?uri=/','');
    		}

      	exportPdf(currentWindow, currentUrl);
    }
}, 1000);