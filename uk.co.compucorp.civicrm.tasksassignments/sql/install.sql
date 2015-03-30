DELETE FROM `civicrm_option_value` WHERE component_id = (SELECT id FROM `civicrm_component` WHERE name = 'CiviTask');
DELETE FROM `civicrm_option_value` WHERE component_id = (SELECT id FROM `civicrm_component` WHERE name = 'CiviDocument');

DELETE FROM civicrm_component WHERE name = 'CiviTask';
DELETE FROM civicrm_component WHERE name = 'CiviDocument';

INSERT INTO `tacivi_5upne`.`civicrm_component` (`id`, `name`, `namespace`) VALUES (NULL, 'CiviTask', 'CRM_CiviTask');
INSERT INTO `tacivi_5upne`.`civicrm_component` (`id`, `name`, `namespace`) VALUES (NULL, 'CiviDocument', 'CRM_CiviDocument');
