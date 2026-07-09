@include('dashboard.components.header')
<?php
enqueue_style('dropzone-css');
enqueue_script('dropzone-js');
?>
<style>
    .pold {
        font-weight: bold;
        color: black;
    }

</style>
<div id="wrapper">
    @include('dashboard.components.top-bar')
    @include('dashboard.components.nav')
    <div class="content-page">
        <div class="content">
            @include('dashboard.components.breadcrumb', ['heading' => __('Usage Agreement')])
            {{--Start Content--}}
            <?php
            $current_user = get_current_user_data();
            $user_id = $current_user->getUserId();
            
            $Agreement=checkAgreement($user_id);
          
             date_default_timezone_set('Asia/Riyadh');
            $mytime = Carbon\Carbon::now();
        
            $retVal = ($Agreement != null) ? getNumberContract($Agreement->id) :  getNumberContract() ;
            ?>

            <script language="javascript">
                function printdiv(printpage) {
                    var headstr = "<html><head><title></title></head><body>";
                    var footstr = "</body>";
                    var newstr = document.all.item(printpage).innerHTML;
                    var oldstr = document.body.innerHTML;
                    document.body.innerHTML = headstr + newstr + footstr;
                    window.print();
                    document.body.innerHTML = oldstr;
                    return false;
                }

            </script>
         
            <div class="row">

                <div class="col-12 col-lg-8 order-lg-4">
                    <div class="card relative p-3">



                        <form action="{{ dashboard_url('contractApproval') }}" class="form form-action mt-3"
                            data-validation-id="form-update-profile" method="post">



                           <div id="myDiv">
                                <style>
                                    .inputForm {
                                        background-color: #f7f7f7;
                                        /*box-shadow: 0px 5px 5px #c7c6c6;*/
                                        height: auto;
                                        line-height: 1.5;
                                        border: 1px solid #ced4da;
                                        border-radius: 25px;
                                        text-align: center
                                    }

                                    #myDiv {
                                        font-family: "Times New Roman";
                                        color: black;
                                        font-weight: 800;
                                        font-size: initial;
                                    }

                                    #number {
                                        text-align: end;
                                        color: orange;
                                        font-size: 15px;
                                    }

                                    table,
                                    th,
                                    td {
                                        border: 1px solid;
                                    }

                                    table {
                                        width: 100%;
                                    }

                                    td:nth-child(1) {
                                        width: 20%;
                                    }

                                    td:nth-child(2) {
                                        width: 80%;
                                    }

                                    caption {
                                        padding-top: 0.85rem;
                                        color: #d60606;
                                        text-align: right;
                                        caption-side: top;
                                    }

                                    input {
                                        width: 90%;
                                        border: none;
                                    }

                                </style>
                                <div class="row">
                                    <div class="row">
                                        <img src="{{asset('images/headContract.jpeg')}}" alt="" width=100%
                                            style="margin-top: -2%;">
                                    </div>
                                    <div class="col-md-6">
                                        <h5>{{__('Usage Agreement')}}</h5>
                                    </div>
                                    <div class="col-md-6" id="number">
                                        <span>   {{ $retVal }}</span>
                                    </div>
                                </div>

                                <p>
                                    اتفا��`ة استخدا�& �&� صة �&ؤسسة شاط�` ا�ترف�`�! (ب�اجات) <br>
                                    بع���  ا���! ��ت��ف�`��! ت�& ا�اتفا� ف�` �`���& ({{ __(date('l')) }}) ��تار�`خ
                                    ({{ $mytime->toDateString() }}) </p>

                                <p><span style="color:blue">
                                        �&ؤسسة شاط�` ا�ترف�`�! (ب�اجات) ب�&��جب ا�سج� ا�تجار�` ر��& (1010751602) ���`�ع �&�ر�!ا
                                        ا�رئ�`س�` ف�` ا�ر�`اض�R ا��&�&�ْة ا�عرب�`ة ا�سع��د�`ة�R طر�`� ا��&�ْ ف�!د ا�فرع�`�R ح�` ا���شا�&�R
                                        برج ا���ش�&�R ا�د��ر ا�سادس.<br>
                                        <br>
                                        �!اتف ر��& (0581633837) ��ع� ��ا�  ا�بر�`د ا�إ�ْتر��� �` info@labayh.sa ���`شار إ��`�!ا ف�`�&ا
                                        بعد ب٬٬٬٬٬ (ا�طرف ا�أ��� أ�� �&ؤسسة شاط�` ا�ترف�`�! (ب�اجات)
                                    </span>

                                    <br>

                                    <!--<table>-->
                                    <!--    <caption>ب�`ا� ات ا�شر�`ْ</caption>-->
                                    <!--    <tr>-->
                                    <!--        <td>ا�س�`د</td>-->
                                    <!--        <td><input type="text" name="name"-->
                                    <!--                value="{{ $current_user->first_name  }} {{ $current_user->last_name  }}">-->
                                    <!--        </td>-->
                                    <!--    </tr>-->
                                    <!--    <tr>-->
                                    <!--        <td> ا���حدةا�ر��&</td>-->
                                    <!--        <td><input type="text"  name="user_id" value="{{ $user_id }}"></td>-->
                                    <!--    </tr>-->
                                    <!--    <tr>-->
                                    <!--        <td>ا�ع� ��ا� </td>-->
                                    <!--        <td><input type="text" name="address" value="{{  $current_user->address  }}"></td>-->
                                    <!--    </tr>-->
                                    <!--    <tr>-->
                                    <!--        <td>ر��& ا��!���`ة</td>-->
                                    <!--        <td> @if ($Agreement != null)-->
                                    <!--          <input type="number" name="ID_number" readonly value="{{ $Agreement->ID_number }}"-->
                                    <!--         readonly>-->
                                    <!--        @else-->
                                    <!--         <input type="number" name="ID_number" value=""-->
                                    <!--       >-->
                                    <!--        @endif</td>-->
                                    <!--    </tr>-->
                                    <!--    <tr>-->
                                    <!--        <td>ا�بر�`د ا�اْتر��� �`</td>-->
                                    <!--        <td><input type="text"   name="email" value="{{ $current_user->email }}"></td>-->
                                    <!--    </tr>-->

                                    <!--</table>-->
                                    
                                           <div class="row mb-1">
                                        <div class="col-md-6 mb-1">
                                            2- ا�س�`د/ <input type="text" readonly class="inputForm" name="name"
                                                value="{{ $current_user->first_name  }} {{ $current_user->last_name  }}">
                                        </div>
                                        <div class="col-md-6 mb-1">
                                            ا��&ض�`ف <input type="text" readonly class="inputForm" name="user_id"
                                                value="{{ $user_id }}">
                                        </div>
                                        <div class="col-md-12 mb-1">
                                            ��ع� ��ا� �! ا��&�&�ْة ا�عرب�`ة ا�سع��د�`ة
                                            <input type="text" class="inputForm" style="width:50%"   name="address"
                                                value="{{  $current_user->address  }}">
                                        </div>

                                        <div class="col-md-6">
                                            @if ($Agreement != null)
                                            ��ر��& ا��!���`ة <input type="number" name="ID_number" readonly value="{{ $Agreement->ID_number }}"
                                            class="inputForm" readonly>
                                            @else
                                            ��ر��& ا��!���`ة <input type="number" name="ID_number" value=""
                                            class="inputForm">
                                            @endif
                                          
                                        </div>
                                        <div class="col-md-6">
                                            ��ع� ��ا�  ا�بر�`د ا�ا�ْتر��� �` <input type="text" class="inputForm" readonly
                                             name="email"
                                                value="{{ $current_user->email }}">

                                        </div>
                                        <br>

                                    </div>

                                    
                                    <br>
                                    ���`شار ا��`ة ف�`�&ا بعد ب (ا�طرف ا�ثا� �` ا�� ا��&ض�`ف) ح�`ث ا�  ا�طرف ا�أ��� �د�`ة �&� صة
                                    إ�ْتر��� �`ة �حجز ��عرض ب�`��ت ا�عط�ات
                                    ��تجارب �&ث�`رة ع��0 سب�`� ا��&ثا� (�&� از� ��ش�� ا��ا�ف�� ا�خاصة ��ا�شا��`�!ات ��ا��&خ�`�&ات
                                    ��ا��&زارع ��غ�`ر�!ا)
                                    ���&رخص �&�  ��زارة ا�س�`اح�`ة ��ح�`ث ا�  ا�طرف
                                    ا�ثا� �` �`�&�ْ ا�� �`د�`ر ع�ارا �&عدا ��تأج�`ر ���`رغب با�إع�ا�  ع� �! ف�` �&� صة ا�طرف ا�أ��� ا��
                                    �د�`�! تجربة �&جت�&ع�`ة
                                    ا�� ف� �`ة ا�� ث�اف�`ة ا�� ر�`اض�`ة ا �&جا� �`ة ا�� ب�&�اب� �&اد�` �`حدد�! �!�� ع��&ا بأ�  ب�اجات تحص�
                                    ع��0 � سبة �&� 
                                    ذ�ْ ا�دخ� �ذا اتف� ا�طرفا�  ���!�&ا بْا�&� أ�!��`ت�!�&ا ا��&عتبرة شرعا ��� ظا�&ا ع��0 ابرا�& �!ذ�!
                                    ا�اتفا��`ة ��ف�ا ��ات�`:
                                    <br>
                                    <span class="pold">
                                        ا��&ادة(1): ت�&�!�`د:
                                    </span>
                                    �`ُعتبر ا�ت�&�!�`د أع�ا�! جزءا�9 �ا �`تجزأ �&�  �!ذ�! ا�اتفا��`ة ���&ْ�&�ا�9 ���&ت�&�&ا�9 ��!ا
                                    <br>
                                    <span class="pold">
                                        ا��&ادة (2): ا�غرض �&�  �!ذ�! ا�اتفا��`ة:
                                    </span>
                                    أبر�&ت �!ذ�! ا�اتفا��`ة �غرض ��`ا�& ا�طرف ا�ثا� �` با�إع�ا�  ع�  ع�ار�! ف�` �&� صة ا�طرف
                                    ا�أ��� أ�� ف�` �&� صات آخر�` ْ�&ا �`را�! ا�طرف ا�أ��� �&� اسبا ��ف�ا�9 �� طا� ا�أ�&��ر ا��&تف� ع��`�!ا
                                    ف�` �!ذ�! ا�اتفا��`ة ��بع�&���ة �&تف� ع��`�!ا �&�  �ب� ا�طرف�`� .
                                    <br>
                                    <span class="pold">
                                        ا��&ادة (3): ا�تزا�&ات ��ح���� ا�طرف ا�أ���:
                                    </span>
                                    �`�تز�& ا�طرف ا�أ��� بتحص�`� ا�عرب���  أ�� ْا�&� ا��&ب�غ �&�  ا�ع�&�`��R أ�&ا استْ�&ا� با��` ا��&ب�غ
                                    (إ�  ��جد) ���&ب�غ ا�تأ�&�`�  ع��0 ا�ع�ار�R �`عتبر �&�  ا�تزا�&ات ا�طرف ا�ثا� �`.
                                    <br>
                                    �`�تز�& ا�طرف ا�أ��� بإخبار ا�طرف ا�ثا� �` بأ�` �&ستجدات ف�` ا��&� صة ا��&تع��ة بطر�`�ة
                                    استخدا�&�!ا ��طرف ا�ثا� �`.
                                    <br>
                                    �`ح� ��طرف ا�أ��� عرض ا�ع�ار ب�&ا �`ت� اسب �&ع �&عا�`�`ر�! ���&تط�بات�!.
                                    <br>
                                    �`�تز�& ا�طرف ا�أ��� بتطب�`� س�`اسة ا�إ�غاء ا�ت�` �`ختار�!ا ا�طرف ا�ثا� �` ف�` ا��&� صة ��س�`عت�&د�!ا
                                    ا�طرف ا�أ��� �د�`�! ْس�`اسة إ�غاء ��استرجاع ��حج��زات. ���ا �`ح� ��طرف ا�ثا� �` ا�رج��ع ع� �!ا
                                    بعد إت�&ا�& ا�حجز.
                                    <br>
                                    <span class="pold">
                                        ا��&ادة (4): ا�تزا�&ات ا�طرف ا�ثا� �`:
                                    </span>
                                    ْ� ا��&ع����&ات ا�ت�` س�`ُع��  ع� �!ا ا�طرف ا�ثا� �` ف�` �&� صة ا�طرف ا�أ��� ستْ���  ظا�!رة ��ع�&�اء
                                    ��س�`ُعت�&د ع��`�!ا �إجراء ا�حج��زات. �ذ�ْ �`�تز�& ا�طرف ا�ثا� �` بأ�  �`ب�`��  ْافة ا��&ع����&ات
                                    ا�صح�`حة ��ا�د��`�ة ��ع�ار ب�&ا ف�` ذ�ْ ع��0 سب�`� ا��&ثا� �ا ا�حصر (ا�أسعار ��ا�ت��افر ��ا�ص��ر
                                    ����صف ا��&ْا�  ��ا��&راف� ��ا�خد�&ات ا�ت�` �`�د�&�!ا ��شر��ط ا�حجز ��غ�`ر�!ا �&�  ا��&ع����&ات ا�ت�` تخص
                                    ا�ع�ار)�R ���`�تز�& ب�&تابعة ��تجد�`د ب�`ا� ات ع�ار�! ف�` حا� حدث أ�` تغ�`�`ر �&�  �ب��!
                                    <span style="color:red">�R ف�!�� ا��&سؤ��� ع�  صحة �!ذ�! ا��&ع����&ات.
                                        <br><br>
                                        �`جب أ�  تْ���  ا�أسعار ا��&عر��ضة ف�` ا��&� صة تسا���` أ�� أ�� �&�  ا�أسعار خارج ا��&� صة ���ا
                                        �`ج��ز أ�  تْ���  ا�أسعار ف�` ا��&� صة أع��0.
                                        <br><br>
                                        �`�تز�& ا�طرف ا�ثا� �` بت��ف�`ر �&ا ت�& حجز�! ف�` تار�`خ ا�حجز ع�  طر�`� ا��&� صة
                                    </span>
                                    �R ��أ�  �`بذ� �صار�0 ج�!د�! ف�` ذ�ْ�R ��ف�` حا� تعذ�ر تس��`�& ا�ع�`�  ا��&حج��ز ة �ظر��ف �ا�!رة ف�` ذات
                                    ا��`���&�R س�`����& ا�طرف ا�أ��� بع�&� حجز آخر ب��`�&ة 150٪ �&�  ��`�&ة ا�حجز ا�أص��`�R ��س�`تح�&� ا�طرف
                                    ا�ثا� �` ��`�&ة 50% �&�  ا�حجز ا�آخر.
                                    �ا �`ح� ��طرف ا�ثا� �` إ�غاء أ�` حجز ت�& ع�  طر�`� ا�طرف ا�أ����R ��إذا أ�غ�0 ا�طرف ا�ثا� �`
                                    ا�حجز ح� ��طرف ا�أ��� إعادة �&ب�غ ا�عرب���  ْا�&�ا�9 ��ع�&�`��R ���`ح� ��طرف ا�أ��� ف�` �!ذ�!
                                    ا�حا�ة خص�& ع�&���ت�! �&�  حساب ا�طرف ا�ثا� �` ا��&��ج��د �د�0 ا�طرف ا�أ���.
                                    <br>
                                    <span class="pold">
                                        ا��&ادة (5): ا�ع�&���ة ��سداد ا��&ب�غ:
                                    </span>
                                    تْ���  ع�&���ة ا�طرف ا�أ��� ف�` ب�`��تات ب�اجات ا�� ا�أ�&اْ�  ا�ت�` �`ت�& ا�إع�ا�  ع� �!ا ف�` ا��&� صة
                                    �&�اب� ْ� حجز ��طرف ا�ثا� �`
                                    <span style="color:red">  {{(float)get_option('partner_commission', 0)}}% </span> ��`�&ة ا�إ�`جار.
                                    <br><br><br>

                                    <mark style="background-color: #fff900;text-decoration: underline;">ب� د خاص ف�` تجارب
                                        �&ث�`رة
                                    </mark> <br> <br>
                                       <mark style="background-color: #fff900;">
                                        ا�&ا ا�إع�ا� ات ا�ت�` تْ���  ض�&�  تجارب �&ث�`رة (فعا��`ات) �`حص� ف�`�!ا ا�طرف ا�أ��� ع��0 � سبة
                                        �&�  ا�دخ� ا��&ح�� �صا�ح ا�طرف ا�ثا� �` �`ص� ا��0  {{(float)get_option('partner_commission_ex', 0)}} %
                                    </mark>
                                    <br>
                                    تصدر ا�فات��رة ف�` تار�`خ �&غادرة ا�ع�&�`�. ��تح��� ا��&با�غ بعد 48 ساعة �&�  تار�`خ �&غادرة
                                    ا�ع�&�`� ع��0 حساب ا�طرف ا�ثا� �` �د�0 (stcpay).ا�� ا�تح���`� ا�ب� ْ�`

                                    <span class="pold">
                                        ا��&ادة (6): ا�أحداث ا���!ر�`ة ��ا�ضرر:
                                    </span>
                                    �ا �`تح�&� ا�طرف ا�أ��� أ�` �&سؤ����`ة ع�  إت�اف أ�� تخر�`ب أ�� سر�ة ا�ع�ار أ�� ا��&تب��` �&� 
                                    ا��&ب�غ ���&ا إ��0 ذ�ْ �&�  �&�&ت�ْات ا�طرف ا�ثا� �` ح�`ث أ�  �&ب�غ ا�تأ�&�`�  �`دفع ��طرف ا�ثا� �` ف�!��
                                    ا��&خ��� ب�&طا�بة ا�ع�&�`� ع�  أ�` تع���`ض.
                                    <br>
                                    �`خ��` ا�طرف ا�أ��� �&سؤ����`ت�! ع�  أ�` ح��ادث ت�ع داخ� ا�ع�`�  ا��&حج��زة �&�  �&��ت �ا س�&ح ا���! أ��
                                    غر� أ�� حر�`� أ�� ج� ا�`ة أ�� �&دا�!�&ة ح�`ث أ�  ثب��ت�`ات ا�ع�&�`� تْ���  بح��زة ا�طرف ا�ثا� �` ���!��
                                    ا��&تصرف ب�!ا.

                                    <br>
                                    <span class="pold">
                                        ا��&ادة (7): �&دة ا�اتفا��`ة:
                                    </span>
                                    تسر�` �!ذ�! ا�اتفا��`ة �&ا دا�& ع�ار ا�طرف ا�ثا� �` �&عر��ضا�9 ع��0 ا��&� صة ��ت� ت�!�` ��تفسخ �!ذ�!
                                    ا�اتفا��`ة ب�&جرد تغ�`�`ر حا�ة عرض ع�ار ا�طرف ا�ثا� �` إ��0 غ�`ر �&عر��ض.
                                    <br>
                                    ف�` حا� رغب أ�` �&�  ا�طرف�`�  فسخ ��إ�غاء ا�اتفا��`ة�R �`ت�& تس���`ة ْافة ا�استح�ا�ات ��إ�غاء
                                    ا�اتفا��`ة.
                                    <br>

                                    <span class="pold">
                                        ا��&ادة (8): أحْا�& عا�&ة:
                                    </span>
                                    تسر�` ع��0 ْ� �&ا ��& �`رد ف�`�! � ص�R خاص ف�` �!ذ�! ا�اتفا��`ة ا�أ� ظ�&ة ��ا����ائح ��ا�تع��`�&ات
                                    ��ا��رارات ��ا�ت� ظ�`�&ات ذات ا�ع�ا�ة ا�سار�`ة ف�` ا��&�&�ْة ا�عرب�`ة ا�سع��د�`ة أث� اء إبرا�& �!ذ�!
                                    ا�اتفا��`ة أ�� خ�ا� فترة سر�`ا� �!ا.
                                    <br>
<br><br>
                                    <span class="pold">
                                        ا��&ادة (9): ا�إشعارات:
                                    </span>
                                    ت��ج��}�! ْافة ا��&راس�ات ��ا�إشعارات ��ا�إطارات ا��&تع��ة ب�!ذ�! ا�اتفا��`ة أ�� أ�` جزءٍ �&� �!ا
                                    إ��0 ا�ع� ا���`�  ا��&� ���! ع� �!ا ف�` �&�د�&ة �!ذ�! ا�اتفا��`ة�R ��تُعد �&ست��&ة حُْ�&ا�9 ���&ُ� تجة�9
                                    �آثار�!ا ا��ا� ��� �`ة إذا ثبت ت��ج�`�!�!ا ��إرسا��!ا إ��0 ت�ْ ا�ع� ا���`�  ب�&ا ف�` ذ�ْ ع� ��ا�  ا�بر�`د
                                    ا�إ�ْتر��� �` ��ت� ب�`�!ات تطب�`� ا�ج��ا� (جاذر إ�  ��أع�&ا�).
                                    <br>

                                    <span class="pold">
                                        ا��&ادة (10): ا�� زاعات ��ا�خ�افات:
                                    </span>
                                    ف�` حا� � ش��ء � زاع ب�`�  أطراف �!ذ�! ا�اتفا��`ة أ�� ب�`� �!�& ��ب�`�  ��رثة أحدٍ �&� �!�& أ�� خُ�فائ�! �&� 
                                    بعد�! ��ْا�  ا�� زاع �&تع��ا�9 ب�!ذ�! ا�اتفا��`ة أ�� �&ا �`� شأ ع� �!ا أ�� بسبب�!ا �&�  ح����ٍ أ��
                                    ا�تزا�&ات�R �`ت�& ح� �!ذا ا�� زاع با�طر� ا���د�ِ�`ة.
                                    <br>
                                    ف�` حا� تعذر ح� ا�� زاع ب�`�  أطراف �!ذ�! ا�اتفا��`ة أ�� ب�`� �!�& ��ب�`�  ��رثة أحدٍ �&� �!�& أ��
                                    خُ�فائ�! �&�  بعد�! با�طر� ا���د�`ة خ�ا� (15) �`���&ا�9 ت����`�&�`ا�9 �&�  تار�`خ � ش��ء ا�� زاع�: �`ْ��� 
                                    ا�اختصاص ا����ائ�` با�فص� ف�` ا�� زاع ���&حْ�&ة ا��&ختصة ف�` �&د�`� ة ا�ر�`اض.
                                    <br>  <br>
                                    <span class="pold">
                                        ا��&ادة (11): � سخ ا�اتفا��`ة:
                                    </span>
                                    حُرر ت �!ذ�! ا�اتفا��`ة �&�  � سخت�`�  أص��`ت�`�  �&تسا���`تا�  ف�` ا����ة ��ا�حج�`ة تتْ���  ْ� � سخة �&� 
                                    إحد�0 عشر (11) �&ادة�R ��است��& ْ� طرفٍ � سخة إ�ْتر��� �`ة �&� �! بعد ا��&��اف�ة ع��`�!ا إ�ْتر��� �`ا�9
                                    �ت� ف�`ذ�!ا ��ا�ع�&� ب�&��جب�!ا�R ���`ُعد تار�`خ �&��اف�ة ا�طرف ا�ثا� �` �!�� تار�`خ بدء سر�`ا�  �!ذ�!
                                    ا�اتفا��`ة. ��ا���! ا��&��ف��R
                                </p>
                                @if ($Agreement != null && $Agreement->status == 1)

                                <div class="row">
                                    <div class="col-md-3">
                                        <h5>
                                            ا�رئ�`س ا�ت� ف�`ذ�` <br>ا�دْت��ر: إ�`اد خش��
                                        </h5>
                                        <img src="{{asset('images/325.jpg')}}" alt="" width="88%">
                                    </div>

                                    <div class="col-md-9" style="margin-top: 13%;">
                                        <label for="">
                                            � سعد بإ� ض�&ا�&ْ �&ع� ا ْشر�`ْ استرات�`ج�` �&ع تح�`ات فر�`� ب�اجات
                                            <br>
                                            <span style="color:red">ف�` حا� ت�& ارسا� ا�ط�ب �&�  �ب� ا��&ا�ْ ��ت�&ت ا��&��اف�ة
                                                ع��`�! ��ت����`ع�! �&�  �ب� �&� صة ب�اجات �`عتبر ا�ع�د �&���ع �&�  ا�طرف�`� </span>
                                        </label>
                                    </div>
                                </div>

                                @endif

                            </div>


                            @include('common.loading')


                                 @if ($Agreement != null && $Agreement->status == 1)
                                             <button class="btn btn-success btn-rounded waves-effect waves-light right"
                                onClick="printdiv('myDiv');">
                                <span class="btn-label"><i class="mdi mdi-check-all"></i></span>
                                {{__('Print')}}
                            </button>
                            @elseif($Agreement != null)
                            <label for="">�`ت�& �&راجعة ط�بْ</label>
                                            @else
                            <button type="submit" class="btn btn-success btn-rounded waves-effect waves-light right">
                                <span class="btn-label"><i class="mdi mdi-check-all"></i></span>
                                {{__('send')}}
                            </button>
                                            @endif
                                            
                          


                        </form>
                    </div>
                </div>
            </div>
            {{--End content--}}
            @include('dashboard.components.footer-content')
        </div>
    </div>
</div>
@include('dashboard.components.footer')

