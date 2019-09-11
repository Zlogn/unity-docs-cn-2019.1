$(function () {
  initializeLanguageSwitcher();
  initializeVersionSwitcher();
  initializeSidebar();
});

/****************************************
 Language Switcher
 ****************************************/

function initializeLanguageSwitcher() {
  if (!offline) {
    checkDocsLanguages();
  } else {
    removeLanguageSwitcher();
  }
}

function checkDocsLanguage(dom) {
  var en_url = "/" + version + "/Documentation/" + docs_type + "/" + page + ".html";
  var _lang = dom.attr("data-lang");

  if (_lang !== "en") {
    var lang_url = "/" + _lang + "/" + version + "/" + docs_type + "/" + page + ".html";

    $.ajax({
      url: lang_url,
      method: "HEAD",
      statusCode: {
        404: function () {
          if (dom) {
            dom.attr("href", en_url);
          }
        }
      }
    });
  }

}

function checkDocsLanguages() {


  var languageSwitcher = $(".lang-switcher");
  languageSwitcher.find(".lang-list a").each(function () {
    checkDocsLanguage($(this))
  })


}

function removeLanguageSwitcher() {
  var languageSwitcher = $(".lang-switcher");
  if (languageSwitcher.length !== 0) {
    languageSwitcher.css("cursor", "default");
    languageSwitcher.find(".arrow").remove();
    languageSwitcher.find(".lang-list").remove();
  }
}

/****************************************
 Version Switcher
 ****************************************/

function initializeVersionSwitcher() {
  if (!offline) {
    checkDocsVersions();
  } else {
    removeVersionSwitcher();
  }
}

function removeVersionSwitcher() {
  var versionSwitcher = $(".version-switcher");
  if (versionSwitcher.length !== 0) {
    versionSwitcher.css("cursor", "default");
    versionSwitcher.find(".arrow").remove();
    versionSwitcher.find(".version-list").remove();
  }
}

function checkDocsVersion(docs_version) {
  if (lang !== "en") {
    var en_url = "/" + docs_version.version_string + "/Documentation/" + docs_type + "/" + page + ".html";
    var lang_url = "/" + lang + "/" + docs_version.version_string + "/" + docs_type + "/" + page + ".html";
    var dom = $(".docs_version_url_" + docs_version.version_string.replace(".", "\\."));
    $.ajax({
      url: lang_url,
      method: "HEAD",
      statusCode: {
        404: function () {
          if (dom) {
            dom.attr("href", en_url);
          }
        }
      }
    });
  }
}

function checkDocsVersions() {
  if (!Array.isArray(docs_versions) && !docs_type && !lang && !page) {
    return;
  }

  for (var docs_version of docs_versions) {
    checkDocsVersion(docs_version);
  }
}

/****************************************
 Sidebar
 ****************************************/

function initializeSidebar() {

  $('html').on('click', function (e) {
    if ($(e.target).closest('.version-switcher').length == 0) {
      $('.version-list').hide();
    }

    if ($(e.target).closest('.sidebar').length == 0) {
      if ($(window).width() < 480 && $(".opened-sidebar").length !== 0) {
        $(".sidebar").trigger("sidebar:close");
      }
    }

  });

  var sidebar = $(".sidebar");
  sidebar.sidebar();

  if ($(window).width() < 900) {
    sidebar.trigger("sidebar:close", [{speed: 0}]);
    $("#content-wrap").removeClass("opened-sidebar");
  } else {
    sidebar.trigger("sidebar:open", [{speed: 0}]);
  }
  sidebar.removeClass("hidden");
  $(window).on("resize", function () {
    if (900 < $(window).width() && $(".opened-sidebar").length === 0) {
      sidebar.trigger("sidebar:open", [{speed: 0}]);
    }
  });
  $("#nav-open").click(function () {
    sidebar.trigger("sidebar:toggle");
  });

  sidebar.on("sidebar:opened", function () {
    $("#content-wrap").addClass("opened-sidebar");
  });

  sidebar.on("sidebar:closed", function () {
    $("#content-wrap").removeClass("opened-sidebar");
  });
}