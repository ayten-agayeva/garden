$(document).ready(() => {
	$("select").selectric({
		labelBuilder: function (text) {
			return '<span class="' + text.className + '">' + text.text + "</span>";
		},
	});
	
	$(".slider_big_img .add_favorites").click(function(event){
	event.stopPropagation();
	});

	$("body").on("click", ".open_popup", function (e) {
		e.preventDefault();
		if ($(this).attr("data-target")) {
			$($(this).attr("data-target")).openPopup();
			if ($(this).hasClass("sign_in"))
				$(".login_signin .tabs a:last").trigger("click");
			else if ($(this).hasClass("log_in"))
				$(".login_signin .tabs a:first").trigger("click");
		}
	});

	$("body").on("click", ".popup a.close", function (e) {
		e.preventDefault();
		$(this).closest(".popup").closePopup();
	});

	//tabs
	$("body").on("click", ".tabs[data-target] > *:not(.active)", function (e) {
		e.preventDefault();
		const tab_parent = $(this).closest(".tabs"),
			target = tab_parent.attr("data-target");
		if (tab_parent.length > 0 && target) {
			const tab = $(this),
				tabs = tab_parent.find(">*"),
				index = tabs.index(tab),
				content = $(target).find(">*");

			tabs.removeClass("active");
			content.removeClass("active");

			tab.addClass("active");
			content.eq(index).addClass("active");
		}
	});

	var btn = $(".back_to_top");

	$(window).scroll(function () {
		if ($(window).scrollTop() > 200) {
			btn.addClass("show");
		} else {
			btn.removeClass("show");
		}
	});

	btn.on("click", function (e) {
		e.preventDefault();
		$("html, body").animate({ scrollTop: 0 }, "200");
	});

	$("form.validation").validationEngine({
		showPrompts: false,
		addFailureCssClassToField: "error",
		onFieldFailure: function (field) {
			if (field) {
				if (field.is(":radio")) {
					$(field).closest(".check_wrap").addClass("error");
				} else {
					$(field).parent().removeClass("success");
				}
			}
		},
		onFieldSuccess: function (field) {
			if (field) {
				if (field.is(":radio")) {
					$(field).closest(".check_wrap").removeClass("error");
				} else if (!$(field).is('[data-mask="phone"]')) {
					const p = $(field).parent();
					if (!p.find("i.success").length)
						$("<i/>").addClass("success").appendTo(p);
					p.addClass("success");
				}
			}
		},
	});
	$("form.validation [class*=validate]").on("change blur keyup", function () {
		$(this).validationEngine("validate");
	});

	$("body").on("click", "form.validation button[type=submit]", function (e) {
		let status = 1;
		$(this)
			.closest("form")
			.find("[class^=validate]")
			.each(function () {
				status = status & !$(this).validationEngine("validate");
			});
		return status;
	});

	$("[data-mask]").each(function () {
		const type = $(this).data("mask");
		switch (type) {
			case "phone":
				$(this).inputmask({
					showMaskOnHover: false,
					mask: "(+abc*) ###-##-##",
					oncomplete: function () {
						const p = $(this).parent();
						if (!p.find("i.success").length)
							$("<i/>").addClass("success").appendTo(p);
						p.addClass("success");
					},
					onincomplete: function () {
						$(this).parent().removeClass("success");
					},
					definitions: {
						"a": {
							validator: "9",
							cardinality: 1,
							casing: "lower",
						},
						"b": {
							validator: "9",
							cardinality: 1,
							casing: "lower",
						},
						"c": {
							validator: "4",
							cardinality: 1,
							casing: "lower",
						},
						"#": {
							validator: "[0-9]",
							cardinality: 1,
							casing: "lower",
						},
						"*": {
							validator: "(10|50|51|55|60|70|77|99)",
							cardinality: 2,
							prevalidator: [{ validator: "[15679]", cardinality: 1 }],
						},
					},
				});
				break;
			case "numeric":
			case "integer":
				$(this).inputmask(type, { rightAlign: false });
				break;
			case "cur":
				$(this).inputmask({
					suffix: " " + $(this).data("currency"),
					groupSeparator: ",",
					alias: "numeric",
					placeholder: "0",
					autoGroup: !0,
					digits: 2,
					digitsOptional: !1,
					clearMaskOnLostFocus: !1,
					rightAlign: false,
				});
				break;
		}
	});

	$("body").on("keyup change", ".shopping-cart textarea", function () {
		this.style.height = "auto";
		this.style.height = this.scrollHeight + "px";
		const max = $(this).data("max");
		const val = $(this).val();
		let vl = $(this).val().length;
		if (vl > max) {
			$(this).val(val.substr(0, max));
			vl = max;
		}
		const t = $(this).closest(".text_on_cart");
		t.find(".text_length>span").html(max - vl);
		t.data("bar").animate(1 - vl / max);
	});

	$(".shopping-cart .text_on_cart").each(function () {
		const t = $(this);
		const bar = new ProgressBar.Circle(t.find(".text_length i")[0], {
			color: "#33B544",
			strokeWidth: 12,
			trailColor: "#ECECEE",
			trailWidth: 12,
			duration: 1400,
			easing: "linear",
			svgStyle: null,
			from: { color: "#FF6243", a: 1 },
			to: { color: "#33B544", a: 0 },
			// Set default step function for all animate calls
			step: function (state, circle) {
				circle.path.setAttribute("stroke", state.color);
			},
		});
		bar.set(1);
		t.data("bar", bar);
		if ($(this).find("textarea").val() != "") $(this).find("textarea").change();
	});

	$("body").on(
		"change",
		".shopping-cart-overview .payment .method input",
		function () {
			const name = $(this).attr("name");
			$(".shopping-cart-overview .payment .checked").removeClass("checked");
			if ($(this).is(":checked"))
				$(this).closest(".method").addClass("checked");
		}
	);

	$("[data-match-height]").each(function () {
		$(this).find($(this).attr("data-match-height")).matchHeight();
	});

	$("body").on("click", ".open_mobile_menu", function () {
		$(".mobile_menu").addClass("animate");
		setTimeout(() => $(".mobile_menu").addClass("active"), 1);
		$("body").addClass("disable_scroll");
	});

	$("body").on("click", ".mobile_popup .header .close", function () {
		const popup = $(this).closest(".mobile_popup");
		popup.removeClass("active");
		setTimeout(() => popup.removeClass("animate"), 400);
		$("body").removeClass("disable_scroll");
	});

	$(".bg_overlay").click(function () {
		$(".mobile_menu").removeClass("active");
		$("body").removeClass("disable_scroll");
	});

	var $window = $(window);
    if ($window.width() < 991) {
        $("body").on("click", ".open_search_menu", function () {
			$(".search_menu").addClass("animate");
			setTimeout(() => $(".search_menu").addClass("active"), 1);
			$("body").addClass("disable_scroll");
		});
	
		$(".close_search_menu").click(function () {
			$(".search_menu").removeClass("active");
			$("body").removeClass("disable_scroll");
		});

		$(".temp_item, .create_temp").click(function() {
			$('html,body').animate({
				scrollTop: $(".tabs_content").offset().top},
				'slow');
		});
	} 
	
	$(".open_mobile_menu").click(function () {
		$(".search_menu").removeClass("active");
	});

	$("body").on("click", ".open_mobile_login", function () {
		$(".mobile_menu").removeClass("active");
	});

	$(".datepicker").datepicker({ autoHide: true, format: "dd/mm/yyyy" });
	$(".datepicker_dd_mm").datepicker({ autoHide: true, format: "dd/mm" });

	if ($(".how-it-works").length > 0) {
		tns({
			container: ".how-it-works .slider",
			controlsText: ["", ""],
			loop: false,
			responsive: {
				0: {
					items: 2,
					gutter: 15,
				},
				"992": {
					items: 6,
					gutter: 30,
				},
			},
		});
	}

	if ($(".blog_detail_page").length > 0) {
		tns({
			container: ".blog_detail_page .slider",
			controlsText: ["", ""],
			loop: false,
			touch: true,
			mouseDrag: true,
			responsive: {
				0: {
					items: 1,
					gutter: 15,
				},
				550: {
					items: 2,
				},
				"992": {
					items: 4,
					gutter: 30,
				},
			},
		});
	}

	if ($(".contact_page").length > 0) {
		let contact_page = null;
		$(document).on("mobile_on mobile_off", () => {
			if (contact_page) contact_page.destroy();
			contact_page = tns({
				container: ".contact_page .comment_slider",
				controls: false,
				loop: false,
				nav: true,
				touch: true,
				mouseDrag: true,
				axis: $.is_mobile ? "horizontal" : "vertical",
				responsive: {
					0: {
						items: 1,
						gutter: 15,
					},
					"992": {
						items: 4,
						gutter: 20,
					},
				},
			});
		});
	}

	if ($(".faq").length > 0) {
		tns({
			container: ".faq .slider",
			controlsText: ["", ""],
			loop: false,
			autoplay: true,
			autoplayButton: false,
			mouseDrag: true,
			touch: true,
			responsive: {
				0: {
					items: 1.5,
					gutter: 15,
				},
				550: {
					items: 2,
				},
				767: {
					items: 3,
				},
				"992": {
					items: 3,
					gutter: 20,
				},
				"1230": {
					items: 4,
					gutter: 20,
				},
			},
		});
	}

	if ($(".product_group").length > 0) {
		const pbs = tns({
			container: ".slider_big_img .slider",
			loop: false,
			autoplayButton: false,
			mouseDrag: true,
			touch: true,
			controls: false,
			nav: false,
			items: 1,
		});
		const pss = tns({
			container: ".product_group .tns_slider",
			controlsText: ["", ""],
			loop: false,
			autoplayButton: false,
			mouseDrag: true,
			touch: true,
			nav: false,
			controls: false,
			axis: "vertical",
			responsive: {
				0: {
					items: 1,
					gutter: 15,
				},
				"992": {
					items: 3,
					gutter: 20,
				},
			},
		});
		$("body").on("click", ".product_imgs .tns_slider .tns-item", function () {
			const index = $(".product_imgs .tns_slider .tns-item").index(this);
			pbs.goTo(index);
		});
		$("body").on("click", ".slider_big_img", function () {
			const items = [],selected = $(this).find(".tns-slide-active img").attr("src");
			let index = 0;
			$('.slider_big_img .tns-item img').each(function(i){
				const src = $(this).attr("src");
				items.push({src:src});
				if(selected == src) index = i;
			});
			$.fancybox.open(items,{},index);
		});
		pbs.events.on("indexChanged", (info) => {
			$(".slider_big_img .step").html(
				info.index + 1 + "/" + $(".slider_big_img .tns-item").length
			);
		});
		$(".slider_big_img .step").html(
			"1/" + $(".slider_big_img .tns-item").length
		);
	}

	if ($(".services_about").length > 0) {
		tns({
			container: ".services_about .services_slider",
			controlsText: ["", ""],
			loop: false,
			autoplayButton: false,
			mouseDrag: true,
			touch: true,
			nav: false,
			loop: true,
			responsive: {
				0: {
					items: 1.5,
					gutter: 30,
				},
				"992": {
					items: 4,
					gutter: 30,
				},
			},
		});
	}
	if ($(".copy_btn").length > 0) {
		new ClipboardJS(".copy_btn");

		$(".copy_btn").click(function () {
			$(this).addClass("copied");
			$(".copy_btn").not(this).removeClass("copied");
			setTimeout(() => $(".copy_btn").removeClass("copied"), 1000);
		});
	}

	// side menu
	$('.navigation a[href*="#"]').on("click", function (e) {
		e.preventDefault();
		var target = $(this).attr("href");
		$("html, body")
			.stop()
			.animate(
				{
					scrollTop: $(target).offset().top,
				},
				600,
				function () {
					location.hash = target;
				}
			);

		return false;
	});

	if ($(".navigation a").length > 0)
		$(window)
			.scroll(function () {
				var scrollDistance = $(window).scrollTop();
				$(".page-section").each(function (i) {
					if ($(this).position().top <= scrollDistance) {
						$(".navigation a.active").removeClass("active");
						$(".navigation a").eq(i).addClass("active");
					}
				});
			})
			.scroll();
	$("#create_temp").click(() => {
		$("#edit_temp form")[0].reset();
		$("#edit_temp").addClass("show");
		$("#edit_temp a.delete").addClass("hide");
	});

	$(".temps .temp_item .switch").click(function (e) {
		e.stopPropagation();
	});
	$(".temp_page:not(.konsiyerj_temp) .temp_item").click(function () {
		const data = $(this).data();
		$("#edit_temp form")[0].reset();
		if (data)
			$.each(data, function (key, value) {
				const el = $(`#edit_temp form [name="${key}"]`);
				if (el.is("input")) el.val(value);
				else if (el.is("select")) {
					el.find("option")
						.prop("selected", false)
						.end()
						.find(`option[value="${value}"]`)
						.prop("selected", true)
						.trigger("change");
				}
			});
		if (!$.is_mobile) $("#edit_temp form select").selectric("refresh");
		$("#edit_temp").addClass("show");
		$("#edit_temp a.delete").removeClass("hide");
	});

	if ($(".home_slider").length > 0) {
		const home_slider = tns({
			container: ".home_slider .slider",
			controlsText: ["", ""],
			items: 1,
			loop: false,
		})
		home_slider.events.on("indexChanged", (info) => {
			home_img_resize($(".home_slider .item").eq(info.index));
		});
		const home_img_resize = (elem)=>{
			const img = $(elem).find(">.img");
			const desc = $(elem).find(">.container>div>.desc");
			const dor = desc.position().left + desc.width() + 50;
			img.removeClass("center").removeAttr("style");
			if (!$.is_mobile && dor > img.position().left) {
				img.addClass("center").css("left", dor);
			}
		};
		const home_slider_resize = () => {
			$(".home_slider .item").each(function () {
			  const item = $(this);
				const img = item.find('>.img img')[0];
				$(img).one('load',()=>{ home_img_resize(item) });
				if(img.complete)home_img_resize(item);
			});
		};
		$(window)
			.resize(home_slider_resize);
			home_slider_resize();
		$(document).on("mobile_on", () => {
			$(".home_slider .item >.img").removeClass("center").removeAttr("style");
		});
		$(document).on("mobile_off", () => {
			home_slider_resize();
		});
	}

	//mobile-menu nav
	$("body").on("click", ".m_nav li:has(ul) .m_nav_link", function (e) {
		e.preventDefault();
		$(".m_nav .m_subnav").slideUp(),
			$(this).next().is(":visible") || $(this).next().slideDown(),
			e.stopPropagation();
	});

	$(".konsiyerj .pro_imgs .item").click(function () {
		$(".pro_big_img img").remove();
		$(this).find("img").clone().appendTo(".pro_big_img");
	});

	$(".user_rating_form").on("change", '[name="rating"]', function () {
		$("#selected-rating").text($('[name="rating"]:checked').val());
	});

	$("#imageUpload").change(function () {
		readURL(this);
	});

	$("body").on("click", ".d_dropdown > span", function () {
		const dd = $(this).closest(".d_dropdown");
		dd.addClass("active");
		$(document).on("click.d_dropdown", function () {
			dd.removeClass("active");
			$(document).off("click.d_dropdown");
		});
	});
	$("body").on("click", ".d_dropdown:not(:has(>span))", function () {
		const dd = $(this);
		if($('.d_dropdown.active').not(this).length>0)$(document).trigger('click');
		dd.addClass("active");
		$(document).one("click.d_dropdown", function () {
			dd.removeClass("active");
		});
	});

	$("body").on("click", ".d_dropdown", function (e) {
		e.stopPropagation();
	});
	$("body").on("click", ".d_dropdown .drop_content a", function (e) {
		$(this).closest(".d_dropdown").removeClass("active");
		$(document).off("click.d_dropdown");
	});

	$("body").on(
		"click",
		"#header .inner .search .d_dropdown button",
		function () {
			$("#header .inner .search .d_dropdown")
				.addClass("saved")
				.removeClass("active");
			$(document).off("click.search");
		}
	);

	var media = window.matchMedia("(max-width: 991px)");
	mobileSupport(media);
	try {
		media.addEventListener("change", mobileSupport);
	} catch (e1) {
		media.addListener(mobileSupport);
	}
});

$.fn.openPopup = function () {
	const elem = $(this);
	if (elem.length > 0) {
		const opened_popup = $(".popup").filter(".show");

		if (opened_popup.length) opened_popup.closePopup();

		elem.addClass("show");
		setTimeout(() => elem.addClass("animate"), 1);
		elem.trigger("openPopup");
		elem.off("click.popup").on("click.popup", function (e) {
			if ($(e.target).hasClass("popup")) elem.closePopup();
		});
	}
};
$.fn.closePopup = function () {
	const elem = $(this);
	if (elem.length > 0) {
		elem.removeClass("animate");
		setTimeout(() => elem.removeClass("show"), 400);
		elem.trigger("closePopup");
	}
};

$(function () {
	$(".hide-show").show();
	$(".hide-show span").addClass("show");

	$(".hide-show span").click(function () {
		const inp = $(this).parent().parent().find("input");
		if ($(this).hasClass("show")) {
			inp.attr("type", "text");
			$(this).removeClass("show");
		} else {
			inp.attr("type", "password");
			$(this).addClass("show");
		}
	});

	$('form button[type="submit"]').on("click", function () {
		$(".hide-show span").addClass("show");
		$(".hide-show").each(function () {
			$(this).parent().find("input").attr("type", "password");
		});
	});
});

var numberSpinner = (function () {
	$(".number-spinner>.ns-btn>a").click(function () {
		var btn = $(this),
			input = btn.closest(".number-spinner").find("input"),
			max = input.attr("max") * 1,
			min = input.attr("min") * 1,
			oldValue = input.val().trim(),
			newVal = 0;

		if (btn.attr("data-dir") === "up") {
			newVal = parseInt(oldValue) + 1;
		} else {
			if (oldValue > 0) {
				newVal = parseInt(oldValue) - 1;
			} else {
				newVal = 0;
			}
		}

		if (newVal <= max && newVal >= min) input.val(newVal);
	});
	$(".number-spinner>input").keypress(function (evt) {
		evt = evt ? evt : window.event;
		var charCode = evt.which ? evt.which : evt.keyCode;
		if (charCode > 31 && (charCode < 48 || charCode > 57)) {
			return false;
		}
		return true;
	});
	$(".number-spinner>input").blur(function () {
		var input = $(this),
			max = input.attr("max") * 1,
			min = input.attr("min") * 1,
			val = input.val().trim();

		if (val > max) input.val(max);
		if (val < min) input.val(min);
	});
})();

$.is_mobile = false;
const mobileSupport = (media) => {
	if (media.matches) {
		$.is_mobile = true;

		if ($(".shopping-cart-overview .block").length)
			$(".shopping-cart-overview .sticky").unstick();

		$(document).trigger("mobile_on");
		if (!$(".mobile_menu .nav").length) mobile_menu_init();
	} else {
		$.is_mobile = false;

		if ($(".shopping-cart-overview .block").length)
			$(".shopping-cart-overview .sticky").sticky({
				topSpacing: 20,
				zIndex: 2,
				bottomSpacing: $("#footer").outerHeight() + 60,
			});

		$(document).trigger("mobile_off");
		$(".mobile_search form").appendTo("#header .search");
		$(".mobile_user .account_menu").appendTo("#header .account");
	}
};

function mobile_menu_init() {
	const nav = $("<ul/>").addClass("nav").appendTo(".mobile_menu .container");
}

$(document).ready(function () {
	var showChar = 205;
	var ellipsestext = "...";
	var moretext = '<i class="fa fa-angle-down"></i>';
	var lesstext = '<i class="fa fa-angle-down"></i>';
	$(".more").each(function () {
		var content = $(this).html();
		if (content.length > showChar) {
			var c = content.substr(0, showChar);
			var h = content.substr(showChar, content.length - showChar);
			var html =
				c +
				'<span class="moreellipses">' +
				ellipsestext +
				'&nbsp;</span><span class="morecontent"><span>' +
				h +
				'</span>&nbsp;&nbsp;<a href="" class="morelink">' +
				moretext +
				"</a></span>";
			$(this).html(html);
		}
	});
	$(".morelink").click(function () {
		if ($(this).hasClass("less")) {
			$(this).removeClass("less");
			$(this).html(moretext);
		} else {
			$(this).addClass("less");
			$(this).html(lesstext);
		}
		$(this).parent().prev().toggle();
		$(this).prev().toggle();
		return false;
	});
});

function readURL(input) {
	if (input.files && input.files[0]) {
		var reader = new FileReader();
		reader.onload = function (e) {
			$("#imagePreview").css(
				"background-image",
				"url(" + e.target.result + ")"
			);
			$("#imagePreview").hide();
			$("#imagePreview").fadeIn(650);
		};
		reader.readAsDataURL(input.files[0]);
	}
}

$.maps = {
	key:window.MAPS_API_KEY,
	loaded: false,
	loading: false,
	callbacks : [],
	load(callback){
	  $.maps.add_callback(callback);
	  if($.maps.loaded)$.maps.run_callback();
	  else if(!$.maps.loading){
		$.maps.loading = true;
		$.getScript('https://maps.googleapis.com/maps/api/js?key='+ $.maps.key +'&callback=$.maps.ready&language=az&region=AZ');
	  }
	},
	ready(){
	  $.maps.loaded = true;
	  $.maps.run_callback();
	},
	add_callback(fn){
	  if(typeof fn !== 'undefined')$.maps.callbacks.push(fn);
	},
	run_callback(){
	  if($.maps.callbacks.length>0){
		$.each($.maps.callbacks,(index,callback)=>{
		  if($.isFunction(callback))callback();
		  else if(typeof window[callback] !== "undefined")window[callback]();
		});
		$.maps.callbacks = [];
	  }
	}
  };

$('[data-maps]').each(function(){
    const id = $(this).attr('id');
    const coords = {lat:$(this).attr('data-lat')*1,lng:$(this).attr('data-lng')*1};
    const zoom = $(this).attr('data-zoom') ? $(this).attr('data-zoom')*1 : 11;
    $.maps.load(()=>{
      const map = new google.maps.Map(document.getElementById(id), {
        zoom: zoom,
        center: coords
      });
      const marker = new google.maps.Marker({
        position: coords,
        icon:'/images/map/select_map_pin.png'
      });
      // adds the marker on the map
      marker.setMap(map);
    });
  });

