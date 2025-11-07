import { getApperClient } from '@/services/apperClient';

class TaskService {
  constructor() {
    this.tableName = 'task_c';
  }

  async getAll() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "due_date_c"}},
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
      console.error("Error fetching tasks:", error);
      throw new Error("Failed to fetch tasks");
    }
  }

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById(this.tableName, parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "due_date_c"}},
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
      console.error(`Error fetching task ${id}:`, error);
      throw new Error(`Failed to fetch task with Id ${id}`);
    }
  }

  async getByContactId(contactId) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        where: [{
          "FieldName": "contact_id_c",
          "Operator": "EqualTo",
          "Values": [parseInt(contactId)],
          "Include": true
        }]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error(`Error fetching tasks for contact ${contactId}:`, error);
      throw new Error("Failed to fetch tasks by contact");
    }
  }

  async create(taskData) {
    try {
      const apperClient = getApperClient();
      
      // Only include Updateable fields
      const payload = {
        records: [{
          title_c: taskData.title_c || taskData.title,
          completed_c: Boolean(taskData.completed_c || taskData.completed || false),
          contact_id_c: parseInt(taskData.contact_id_c || taskData.contactId),
          due_date_c: taskData.due_date_c || taskData.dueDate
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
          console.error(`Failed to create ${failed.length} tasks:`, failed);
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
      console.error("Error creating task:", error);
      throw new Error("Failed to create task");
    }
  }

  async update(id, taskData) {
    try {
      const apperClient = getApperClient();
      
      // Only include Updateable fields
      const payload = {
        records: [{
          Id: parseInt(id),
          title_c: taskData.title_c || taskData.title,
          completed_c: Boolean(taskData.completed_c !== undefined ? taskData.completed_c : taskData.completed),
          contact_id_c: parseInt(taskData.contact_id_c || taskData.contactId),
          due_date_c: taskData.due_date_c || taskData.dueDate
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
          console.error(`Failed to update ${failed.length} tasks:`, failed);
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
      console.error(`Error updating task ${id}:`, error);
      throw new Error("Failed to update task");
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
          console.error(`Failed to delete ${failed.length} tasks:`, failed);
          failed.forEach(record => {
            if (record.message) {
              throw new Error(record.message);
            }
          });
        }
        
        return successful.length > 0;
      }
    } catch (error) {
      console.error(`Error deleting task ${id}:`, error);
      throw new Error("Failed to delete task");
    }
  }
}

export const taskService = new TaskService();
export const taskService = new TaskService();