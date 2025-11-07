import { getApperClient } from '@/services/apperClient';

class ActivityService {
  constructor() {
    this.tableName = 'activity_c';
  }

  async getAll() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "timestamp_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "deal_id_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        orderBy: [{
          "fieldName": "timestamp_c",
          "sorttype": "DESC"
        }]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching activities:", error);
      throw new Error("Failed to fetch activities");
    }
  }

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById(this.tableName, parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "timestamp_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "deal_id_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching activity ${id}:`, error);
      throw new Error(`Failed to fetch activity with Id ${id}`);
    }
  }

  async getByContactId(contactId) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "timestamp_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "deal_id_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        where: [{
          "FieldName": "contact_id_c",
          "Operator": "EqualTo",
          "Values": [parseInt(contactId)],
          "Include": true
        }],
        orderBy: [{
          "fieldName": "timestamp_c",
          "sorttype": "DESC"
        }]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error(`Error fetching activities for contact ${contactId}:`, error);
      throw new Error("Failed to fetch activities by contact");
    }
  }

  async getByDealId(dealId) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "timestamp_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "deal_id_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        where: [{
          "FieldName": "deal_id_c",
          "Operator": "EqualTo",
          "Values": [parseInt(dealId)],
          "Include": true
        }],
        orderBy: [{
          "fieldName": "timestamp_c",
          "sorttype": "DESC"
        }]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error(`Error fetching activities for deal ${dealId}:`, error);
      throw new Error("Failed to fetch activities by deal");
    }
  }

  async create(activityData) {
    try {
      const apperClient = getApperClient();
      
      // Only include Updateable fields
      const payload = {
        records: [{
          description_c: activityData.description_c || activityData.description,
          type_c: activityData.type_c || activityData.type,
          timestamp_c: activityData.timestamp_c || activityData.timestamp,
          contact_id_c: activityData.contact_id_c ? parseInt(activityData.contact_id_c) : (activityData.contactId ? parseInt(activityData.contactId) : null),
          deal_id_c: activityData.deal_id_c ? parseInt(activityData.deal_id_c) : (activityData.dealId ? parseInt(activityData.dealId) : null)
        }]
      };

      const response = await apperClient.createRecord(this.tableName, payload);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} activities:`, failed);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => {
                throw new Error(`${error.fieldLabel}: ${error.message}`);
              });
            }
            if (record.message) {
              throw new Error(record.message);
            }
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error creating activity:", error);
      throw new Error("Failed to create activity");
    }
  }

  async update(id, activityData) {
    try {
      const apperClient = getApperClient();
      
      // Only include Updateable fields
      const payload = {
        records: [{
          Id: parseInt(id),
          description_c: activityData.description_c || activityData.description,
          type_c: activityData.type_c || activityData.type,
          timestamp_c: activityData.timestamp_c || activityData.timestamp,
          contact_id_c: activityData.contact_id_c ? parseInt(activityData.contact_id_c) : (activityData.contactId ? parseInt(activityData.contactId) : null),
          deal_id_c: activityData.deal_id_c ? parseInt(activityData.deal_id_c) : (activityData.dealId ? parseInt(activityData.dealId) : null)
        }]
      };

      const response = await apperClient.updateRecord(this.tableName, payload);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} activities:`, failed);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => {
                throw new Error(`${error.fieldLabel}: ${error.message}`);
              });
            }
            if (record.message) {
              throw new Error(record.message);
            }
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error(`Error updating activity ${id}:`, error);
      throw new Error("Failed to update activity");
    }
  }

  async delete(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.deleteRecord(this.tableName, {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} activities:`, failed);
          failed.forEach(record => {
            if (record.message) {
              throw new Error(record.message);
            }
          });
        }
        
        return successful.length > 0;
      }
    } catch (error) {
      console.error(`Error deleting activity ${id}:`, error);
      throw new Error("Failed to delete activity");
    }
  }
}

export const activityService = new ActivityService();