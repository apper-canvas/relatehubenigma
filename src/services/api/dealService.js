import { getApperClient } from '@/services/apperClient';

class DealService {
  constructor() {
    this.tableName = 'deal_c';
  }

  async getAll() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "probability_c"}},
          {"field": {"Name": "expected_close_date_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching deals:", error);
      throw new Error("Failed to fetch deals");
    }
  }

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById(this.tableName, parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "probability_c"}},
          {"field": {"Name": "expected_close_date_c"}},
          {"field": {"Name": "contact_id_c"}},
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
      console.error(`Error fetching deal ${id}:`, error);
      throw new Error(`Failed to fetch deal with Id ${id}`);
    }
  }

  async create(dealData) {
    try {
      const apperClient = getApperClient();
      
      // Only include Updateable fields
      const payload = {
        records: [{
          title_c: dealData.title_c || dealData.title,
          value_c: parseFloat(dealData.value_c || dealData.value || 0),
          stage_c: dealData.stage_c || dealData.stage,
          probability_c: parseInt(dealData.probability_c || dealData.probability || 0),
          expected_close_date_c: dealData.expected_close_date_c || dealData.expectedCloseDate,
          contact_id_c: parseInt(dealData.contact_id_c || dealData.contactId)
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
          console.error(`Failed to create ${failed.length} deals:`, failed);
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
      console.error("Error creating deal:", error);
      throw new Error("Failed to create deal");
    }
  }

  async update(id, dealData) {
    try {
      const apperClient = getApperClient();
      
      // Only include Updateable fields
      const payload = {
        records: [{
          Id: parseInt(id),
          title_c: dealData.title_c || dealData.title,
          value_c: parseFloat(dealData.value_c || dealData.value || 0),
          stage_c: dealData.stage_c || dealData.stage,
          probability_c: parseInt(dealData.probability_c || dealData.probability || 0),
          expected_close_date_c: dealData.expected_close_date_c || dealData.expectedCloseDate,
          contact_id_c: parseInt(dealData.contact_id_c || dealData.contactId)
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
          console.error(`Failed to update ${failed.length} deals:`, failed);
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
      console.error(`Error updating deal ${id}:`, error);
      throw new Error("Failed to update deal");
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
          console.error(`Failed to delete ${failed.length} deals:`, failed);
          failed.forEach(record => {
            if (record.message) {
              throw new Error(record.message);
            }
          });
        }
        
        return successful.length > 0;
      }
    } catch (error) {
      console.error(`Error deleting deal ${id}:`, error);
      throw new Error("Failed to delete deal");
    }
  }
}

export const dealService = new DealService();