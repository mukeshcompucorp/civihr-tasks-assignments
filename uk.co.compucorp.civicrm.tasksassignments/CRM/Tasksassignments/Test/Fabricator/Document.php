<?php
use CRM_HRCore_Test_Fabricator_Contact as ContactFabricator;

/**
 * Documents Fabricator class
 */
class CRM_Tasksassignments_Test_Fabricator_Document {
  private static $defaultParams = [];

  /**
   * Fabricates Document using the BAO.
   *
   * @param array $params
   *   List of parameters to be passed to the BAO call.
   *
   * @return CRM_Tasksassignments_DAO_Document|NULL|object
   */
  public static function fabricate($params = []) {
    self::setDefaultParameters();
    return CRM_Tasksassignments_BAO_Document::create(array_merge(self::$defaultParams, $params));
  }

  /**
   * Fabricates Document using an API call.
   *
   * @param $params
   *   List of parameters to be passed to the API call.
   *
   * @return array
   */
  public static function fabricateWithAPI($params = []) {
    self::setDefaultParameters();
    $result = civicrm_api3(
      'Document',
      'create',
      array_merge(self::$defaultParams, $params)
    );

    return array_shift($result['values']);
  }

  /**
   * Sets default minimum parametrs to create a document.
   */
  private static function setDefaultParameters() {
    $contact = ContactFabricator::fabricate();

    self::$defaultParams = [
      'activity_type_id' => self::getTestDocumentTypeID(),
      'activity_date_time' => date('Y-m-d'),
      'status_id' => CRM_Tasksassignments_BAO_Document::STATUS_AWAITING_UPLOAD,
      'priority_id' => self::getTestPriorityID(),
      'source_contact_id' => $contact['id'],
      'target_contact_id' => [$contact['id']],
      'assignee_contact_id' => [$contact['id']],
    ];
  }

  /**
   * Obtains the ID for the first document type it finds.
   *
   * @return int
   *   ID of the first valid document type found on the database
   */
  private function getTestDocumentTypeID() {
    $result = civicrm_api3('OptionValue', 'get', [
      'sequential' => 1,
      'option_group_id' => 'activity_type',
      'options' => ['limit' => 1],
      'component_id' => 'CiviDocument',
    ]);

    return $result['values'][0]['value'];
  }

  /**
   * Obtains the ID for the first priority it finds.
   *
   * @return int
   *   ID of the first valid priority found on the database
   */
  private function getTestPriorityID() {
    $result = civicrm_api3('OptionValue', 'get', [
      'sequential' => 1,
      'option_group_id' => 'priority',
      'options' => ['limit' => 1],
    ]);

    return $result['values'][0]['value'];
  }
}
