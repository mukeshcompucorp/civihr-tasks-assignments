<?php

class CRM_Documentsassignments_BAO_Document extends CRM_Documentsassignments_DAO_Document
{
  /**
   * Create a new Document based on array-data
   *
   * @param array $params key-value pairs
   * @return CRM_Documentsassignments_DAO_Document|NULL
   *
  public static function create($params) {
    $className = 'CRM_Documentsassignments_DAO_Document';
    $entityName = 'Document';
    $hook = empty($params['id']) ? 'create' : 'edit';

    CRM_Utils_Hook::pre($hook, $entityName, CRM_Utils_Array::value('id', $params), $params);
    $instance = new $className();
    $instance->copyValues($params);
    $instance->save();
    CRM_Utils_Hook::post($hook, $entityName, $instance->id, $instance);

    return $instance;
  } */
}
