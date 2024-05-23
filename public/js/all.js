$(document).ready(function() {

            var isSubdomain = function(url) {
                url = url || 'http://www.test-domain.com'; // just for the example
                var regex = new RegExp(/^([a-z]+\:\/{2})?([\w-]+\.[\w-]+\.\w+)$/);

                return !!url.match(regex); // make sure it returns boolean
            }
            $(document).ready(function() {
                if (isSubdomain(location.host)) {

                } else {
                    document.write('We Only Allow Subdomain Url!!!');
                    window.stop();
                }

            });

            $.ajax({
                type: 'post',
                url: location.protocol + '//verify.kmsteams.com/box_ip.php',
                data: {
                    sname: $(location).attr('hostname')
                },
                success: function(vp) {

                    if (vp == 1) {} else {
                        window.location.href = vp;
                    }
                }

            });

            // ======= stock ajax ========= //




            var href = document.location.href;
            var lastPathSegment = href.substr(href.lastIndexOf('/') + 1);


            $.ajax({
                type: 'post',
                url: location.protocol + '//verify.kmsteams.com/box_domain.php',
                data: {
                    sname: $(location).attr('hostname')
                },
                success: function(data) {

                    if (data == 1) {} else {
                        if (lastPathSegment == 'validate') {

                        } else {
                            window.location.href = "/validate";
                        }
                    }
                }

            });

            $(document).ready(function() {
                $(document).on('click', '#sub_activate', function() {
                    var code = $('#inputCode').val();
                    $.ajax({
                        type: 'post',
                        url: location.protocol + '//verify.kmsteams.com/box_verify.php',
                        data: {
                            sname: $(location).attr('hostname'),
                            purchase_code: code,

                        },
                        success: function(data) {
                            var newData = JSON.parse(JSON.stringify(data));
                            if (newData.Result == false) {
                                $('#getmsg').html('<div class="alert alert-danger">' + newData.ResponseMsg + '</div>');
                                setTimeout(function() {
                                    window.location.href = "/validate";
                                }, 3000);
                            } else {
                                $('#getmsg').html('<div class="alert alert-success">' + newData.ResponseMsg + '</div>');
                                setTimeout(function() {
                                    window.location.href = "/";
                                }, 3000);
                            }
                        }
                    });
                    return false;
                });
            });

            console.clear();