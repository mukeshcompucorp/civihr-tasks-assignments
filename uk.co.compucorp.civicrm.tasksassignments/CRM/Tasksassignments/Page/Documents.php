<?php

require_once 'CRM/Core/Page.php';

class CRM_Tasksassignments_Page_Documents extends CRM_Core_Page {
    function run() {
        // Example: Set the page-title dynamically; alternatively, declare a static title in xml/Menu/*.xml
        CRM_Utils_System::setTitle(ts('Documents'));

        // Example: Assign a variable for use in a template
        $this->assign('currentTime', date('Y-m-d H:i:s'));

        parent::run();
    }

    static function registerScripts() {

        static $loaded = FALSE;
        if ($loaded) {
            return;
        }
        $loaded = TRUE;

        CRM_Core_Resources::singleton()
            ->addSettingsFactory(function () {
                global $user;
                $config = CRM_Core_Config::singleton();
                return array(
                    'Tasksassignments' => array(
                        'extensionPath' => CRM_Core_Resources::singleton()->getUrl('uk.co.compucorp.civicrm.tasksassignments'),
                    ),
                    'adminId' => CRM_Core_Session::getLoggedInContactID(),
                    'contactId' => CRM_Utils_Request::retrieve('cid', 'Integer'),
                    'debug' => $config->debug,
                );
            });

    }
}