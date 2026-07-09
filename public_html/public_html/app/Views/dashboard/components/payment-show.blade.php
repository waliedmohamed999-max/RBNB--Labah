<?php
enqueue_script('nice-select-js');
enqueue_style('nice-select-css');

enqueue_script('flatpickr-js');
enqueue_style('flatpickr-css');
// dd($user);
?>

                            <div class="form-group">
                                <label for="payout_payment">{{__('Payment Gateway')}}</label>
                                <?php
                                enqueue_script('nice-select-js');
                                enqueue_style('nice-select-css');

                                $allPayments = get_available_payments();
                                $payout_payment = get_user_meta($user_id, 'payout_payment');
                                ?>
                                <select name="payout_payment" id="payout_payment" class="form-control wide"
                                        data-plugin="customselect" disabled>
                                    <option value="">{{__('---- Select ----')}}</option>
                                    <?php foreach($allPayments as $class){
                                    $logo = $class::getLogo();
                                    $name = $class::getName();
                                    $id = $class::getID();
                                    ?>
                                    <option value="{{ $id }}"
                                            data-icon="<img class='mr-1' width='24' height='24' src='{{$logo}}'>"
                                            @if($id == $payout_payment) selected @endif>{{ $name }}</option>
                                    <?php } ?>
                                </select>
                            </div>
                            <?php
                            $payout_detail = get_user_meta($user_id, 'payout_detail');
                            ?>
                            <div class="form-group">
                                <label for="payout-detail">{{__('Payment Detail')}}
                                </label>
                                <textarea name="payout_detail" id="payout-detail"
                                          class="form-control" disabled>{{$payout_detail}}</textarea>
                            </div>
                        
