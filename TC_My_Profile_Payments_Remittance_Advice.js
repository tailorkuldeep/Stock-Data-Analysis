/*
    Script Name: TC_My_Profile_Payments_Remittance_Advice
    Created By: Dhanya on 2019-08-27
    Story Number: BMHB2B- 6802
    Story Name:My_Profile_Payments_Remittance_Advice
*/

'use strict';

//IMPORTS
const executeStep = require('../../../../steps/step_exec.js');
const utils = require('../../../../utils/utils.js');
const assert = require('../../../../utils/assert.utils.js');
const CommonSteps = require('../../../../steps/CommonSteps.js');
const RetailerOrdersPageSteps = require('../../../../steps/RetailerOrdersPageSteps.js');
const RetailerOrdersPage = require('../../../../pages/RetailerOrdersPage.js');
const CICHomePageSteps = require('../../../../steps/CICHomePageSteps.js');
const RemittanceAdvicePageSteps = require('../../../../steps/RemittanceAdvicePageSteps');
const RemittanceAdvicePage = require('../../../../pages/RemittanceAdvicePage');

var data = require('../../../../rsc/test_data_my_profile.json');
if (browser.params.env == 'dev') {
    data = require('../../../../rsc_dev/test_data_my_profile.json');
}

let common_data = utils.load_property_file('default');
let domain = browser.params.env_us.staging;

let tc_name = 'TC_My_Profile_Payments_Remittance_Advice';
var order_number;

describe('STORY: MY_PROFILE_PAYMENTS', () => {

    let test_data = [];
    let localized_data;
    let str_sku;
    let str_product_selected;

    utils.set_test_data(data, tc_name, function (response) {
        test_data = response;
        test_desc = test_data.tc_description;
    });

    beforeAll(() => {
        localized_data = utils.load_property_file(test_data.country[2]);
    });

    it(test_data.tc_description, () => {
        //launch okta url
        executeStep('STEP ' + global.step_counter++ + ': PROCESS: LAUNCH STORE FRONT', () => {
            browser.get(browser.params.oktaUrl);
        });

        //Log in to OKTA preview page
        executeStep('STEP ' + global.step_counter++ + ': PROCESS: LOGIN', () => {
            CICHomePageSteps.process_login(test_data.username, test_data.password);
            console.log("[INFO] Logged in successfully");
        });

        // clicking on Hybris ASM Dashboard tile
        executeStep('STEP ' + global.assert_counter++ + ': CLICK:ASM TILE', () => {
            CICHomePageSteps.click_asm_tile(browser.params.env);
            console.log("[INFO] Successfully navigated to CIC dashboard page");
        });

        // select user details 
        executeStep('STEP ' + global.assert_counter++ + ': SELECT :RETAILER USER DETAILS', () => {
            CICHomePageSteps.select_user_detail(test_data.retailer_user);
            console.log("[INFO] Successfully navigated to CIC dashboard page");
        });

        executeStep('STEP ' + global.step_counter++ + ': CLICK: MENU MY PROFILE', () => {
            //click on my profile menu  button
            CommonSteps.click_menu_my_profile();
            console.log("[INFO] Click menu profile button");
        });

        executeStep('STEP ' + global.step_counter++ + ': CLICK: REMITTANCE ADVICE LINK', () => {
            //Click remittance advice link
            RemittanceAdvicePageSteps.click_remittance_advice_link();
            console.log("[INFO] Click remittance advice link");
        });
        RemittanceAdvicePage.txt_zero_order.getText().then(function (result) {
            if (result != 0) {

                executeStep('ASSERT ' + global.step_counter++ + ': COLUMN HEADER', () => {
                    //ASSERT COLUMN HEADER
                    assert.is_visible(RemittanceAdvicePage.txt_doc_id_header);
                    assert.is_visible(RemittanceAdvicePage.txt_doc_type_header);
                    assert.is_visible(RemittanceAdvicePage.txt_doc_date_header);
                    assert.is_visible(RemittanceAdvicePage.txt_doc_total_header);
                    console.log("[INFO] ASSERT COLUMN HEADER");
                });

                executeStep('ASSERT ' + global.step_counter++ + ': SEARCH INFORMATION TEXT', () => {
                    //ASSERT COLUMN HEADER
                    RemittanceAdvicePageSteps.get_search_info_text(function (response) {
                        assert.string_compare(response, test_data.search_information_text);
                    })
                    console.log("[INFO] ASSERT SEARCH INFORMATION TEXT");
                });


                //validate link content
                executeStep('ASSERT ' + global.assert_counter++ + ': LINK CONTENT', () => {
                    RemittanceAdvicePageSteps.validate_document_link();
                    console.log("[INFO] LINK CONTENT");

                });

                executeStep('ASSERT ' + global.step_counter++ + ':  SORTING OF DOCUMENT ID ', () => {
                    //ASSERT SORTING OF DOCUMENT ID
                    RemittanceAdvicePageSteps.sort_document_id_column();
                    console.log("[INFO] ASSERT DEFAULT SORTING OF TABLE DOCUMENT ID ");
                });


                //ASSERT DOCUMENT TYPE VALUE
                executeStep('ASSERT ' + global.step_counter++ + ':  DOCUMENT TYPE VALUE', () => {
                    console.log("[INFO] ASSERT DOCUMENT TYPE VALUE");
                    RemittanceAdvicePageSteps.validate_document_type_values(test_data.document_Type);
                });

                executeStep('STEP ' + global.step_counter++ + ': SEARCH WITH LAST TEN DAYS DOCUMENTS AND VALIDATE RESPONSE  ', () => {
                    //SEARCH WITH LAST TEN DAYS DOCUMENTS AND VALIDATE RESPONSE
                    RemittanceAdvicePageSteps.search_last_ten_or_thirty_days_documents(test_data.ten_days);
                    console.log("[INFO]  SEARCH WITH LAST TEN DAYS DOCUMENTS AND VALIDATE RESPONSE");
                });

                executeStep('ASSERT ' + global.step_counter++ + ': SEARCH RESPONSE FOR EMPTY SEARCH', () => {
                    //Click remittance advice link
                    RetailerOrdersPageSteps.get_order_count(function (order_count_bef) {

                        executeStep('STEP ' + global.step_counter++ + ': CLICK: APPLY FILTER BUTTON', () => {
                            //CLICK ON APPLY FILTER BUTTON
                            RetailerOrdersPageSteps.click_apply_filter_button();
                            console.log("[INFO] CLICK ON APPLY FILTER BUTTON");
                        });

                        RetailerOrdersPageSteps.get_order_count(function (order_count_aft) {
                            assert.value_compare(order_count_bef, order_count_aft);
                        });

                    });
                    console.log("[INFO] Click remittance advice link");
                });

                //Search with document ID
                executeStep('STEP ' + global.step_counter++ + ':  SEARCH: DOCUMENT ID ', () => {
                    console.log("[INFO] Search with document ID");
                    RemittanceAdvicePageSteps.search_with_document_id();
                });

                executeStep('STEP ' + global.step_counter++ + ': SEARCH WITH PARTIAL ORDER NUMBER', () => {
                    //ASSERT SEARCH WITH PARTIAL ORDER NUMBER
                    RemittanceAdvicePageSteps.search_with_partial_order_number();
                    console.log("[INFO] SEARCH WITH PARTIAL ORDER NUMBER");
                });


                executeStep('STEP ' + global.step_counter++ + ': SEARCH WITH ORDER NUMBER WITH LEADING AND TRAILING SPACES', () => {
                    //SEARCH WITH JOB NAME AND VALIDATE RESPONSE
                    RemittanceAdvicePageSteps.search_with_order_number_with_space();
                    console.log("[INFO] STEP SSEARCH WITH ORDER NUMBER WITH LEADING AND TRAILING SPACES");
                });

                executeStep('STEP ' + global.step_counter++ + ': CLICK : SORT OPTION ', () => {
                    //CLICK SORT OPTION
                    RemittanceAdvicePageSteps.click_sort_option();
                    console.log("[INFO] CLICK ON SORT OPTION");
                });

                executeStep('STEP ' + global.step_counter++ + ': CLICK : SORT BY DOC DATE ', () => {
                    //CLICK SORT BY NEEDS BY DATE OPTION
                    RemittanceAdvicePageSteps.click_opt_sort_by_doc_date();
                    console.log("[INFO] CLICK SORT BY DOC DATE");
                });

                executeStep('ASSERT ' + global.step_counter++ + ':  SORTING OF DOCUMENT DATE ', () => {
                    //ASSERT SORTING OF DOCUMENT DATE
                    RemittanceAdvicePageSteps.sort_document_date(RemittanceAdvicePage.tbl_document_date_row);
                    console.log("[INFO] ASSERT SORTING OF DOCUMENT DATE ");
                });

                executeStep('STEP ' + global.step_counter++ + ': CLICK: MORE OPTIONS FILTER ', () => {
                    //CLICK ON MORE OPTIONS FILTER
                    RemittanceAdvicePageSteps.click_more_options_button();
                    console.log("[INFO] CLICK ON MORE OPTIONS FILTER");
                });

                executeStep('STEP ' + global.step_counter++ + ': SEARCH WITH LAST THIRTY DAYS DOCUMENTS AND VALIDATE RESPONSE  ', () => {
                    //SEARCH WITH LAST THIRTY DAYS DOCUMENTS AND VALIDATE RESPONSE
                    RemittanceAdvicePageSteps.search_last_ten_or_thirty_days_documents(test_data.thirty_days);
                    console.log("[INFO]  SEARCH WITH LAST THIRTY DAYS DOCUMENTS AND VALIDATE RESPONSE");
                });

                executeStep('STEP ' + global.step_counter++ + ': CLICK: MORE OPTIONS FILTER ', () => {
                    //CLICK ON MORE OPTIONS FILTER
                    RemittanceAdvicePageSteps.click_more_options_button();
                    console.log("[INFO] CLICK ON MORE OPTIONS FILTER");
                });

                executeStep('STEP ' + global.step_counter++ + ': CLICK: DOCUMENT DATE RANGE RADIO BUTTON ', () => {
                    //CLICK DOCUMENT DATE RANGE RADIO BUTTON
                    RemittanceAdvicePageSteps.click_document_date_range_radio_button();
                    console.log("[INFO] CLICK DOCUMENT DATE RANGE RADIO BUTTON");
                });

                executeStep('STEP ' + global.step_counter++ + ': SEARCH WITH DOCUMENT DATE RANGE  ', () => {
                    //SEARCH WITH DOCUMENT DATE RANGE
                    RemittanceAdvicePageSteps.search_with_document_date_range();
                    console.log("[INFO]  SEARCH WITH DOCUMENT DATE RANGE");
                });

                //Search with invalid search input
                executeStep('STEP ' + global.step_counter++ + ':  SEARCH: INVALID SEARCH INPUT ', () => {
                    console.log("[INFO]  Search with invalid input");
                    RemittanceAdvicePageSteps.search_with_invalid_input(test_data.invalid_input);
                });

                //Search with invalid search input and validate response
                executeStep('ASSERT ' + global.step_counter++ + ':  SEARCH: NO ORDERS FOUND RESPONSE ', () => {
                    console.log("[INFO] Validating no orders found for search response");
                    assert.is_visible(RemittanceAdvicePage.txt_zero_order);
                });
            }
        });

    });

    afterEach(() => {
        utils.reset_counters();
    });

    afterAll(() => {
        utils.clean_up(tc_name);
    });

});
