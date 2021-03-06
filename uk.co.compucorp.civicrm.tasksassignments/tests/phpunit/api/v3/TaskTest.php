<?php

/**
 * Class Api_TaskTest
 */
class api_v3_TaskTest extends CiviUnitTestCase {

  /**
   * @var int
   */
  private $_taskTypeId;

  /**
   * Runs the upgrader and creates task type required for test
   */
  public function setUp() {
    parent::setUp();
    $upgrader = CRM_Tasksassignments_Upgrader::instance();
    $upgrader->install();

    $result = civicrm_api3('OptionValue', 'create', [
      'option_group_id' => 'activity_type',
      'component_id' => 'CiviTask',
      'label' => 'Sample Task Type',
    ]);
    $result = array_pop($result['values']);

    $this->_taskTypeId = $result['value'];
  }

  /**
   * Remove data created in setUp()
   */
  protected function tearDown() {
    civicrm_api3('OptionValue', 'get', [
      'option_group_id' => 'activity_type',
      'component_id' => 'CiviTask',
      'value' => $this->_taskTypeId,
      'api.OptionValue.delete' => ['id' => '$value.id'],
    ]);

    parent::tearDown();
  }

  /**
   * @expectedException CiviCRM_API3_Exception
   */
  public function testCreateTaskWithNoContacts() {
    civicrm_api3('Task', 'create', [
      'activity_type_id' => $this->_taskTypeId,
    ]);
  }

  /**
   * @expectedException CiviCRM_API3_Exception
   */
  public function testCreateTaskWithNoSource() {
    civicrm_api3('Task', 'create', [
      'activity_type_id' => $this->_taskTypeId,
      'assignee_contact_id' => 1,
      'target_contact_id' => 2,
    ]);
  }

  public function testCreateTaskWithNoAssignee() {
    $result = civicrm_api3('Task', 'create', [
      'activity_type_id' => $this->_taskTypeId,
      'source_contact_id' => 1,
      'target_contact_id' => 2,
    ]);

    $firstResult = array_pop($result['values']);

    $this->assertEquals(0, $result['is_error']);
    $this->assertEquals(1, $firstResult['source_contact_id']);
  }

  /**
   * @expectedException CiviCRM_API3_Exception
   */
  public function testCreateTaskWithNoTarget() {
    civicrm_api3('Task', 'create', [
      'activity_type_id' => $this->_taskTypeId,
      'source_contact_id' => 1,
      'assignee_contact_id' => 2,
    ]);
  }

}
