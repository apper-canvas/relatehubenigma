import { getApperClient } from '@/services/apperClient';

class ContactService {
  constructor() {
    this.tableName = 'contact_c';
  }

  async getAll() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "tags_c"}},
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
      console.error("Error fetching contacts:", error);
      throw new Error("Failed to fetch contacts");
    }
  }

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById(this.tableName, parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "tags_c"}},
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
      console.error(`Error fetching contact ${id}:`, error);
      throw new Error(`Failed to fetch contact with Id ${id}`);
    }
  }

  async create(contactData) {
    try {
      const apperClient = getApperClient();
      
      // Only include Updateable fields
      const payload = {
        records: [{
          name_c: contactData.name_c || contactData.name,
          email_c: contactData.email_c || contactData.email,
          company_c: contactData.company_c || contactData.company,
          phone_c: contactData.phone_c || contactData.phone,
          notes_c: contactData.notes_c || contactData.notes,
tags_c: Array.isArray(contactData.tags_c || contactData.tags) 
            ? (contactData.tags_c || contactData.tags).join(",")
            : (contactData.tags_c || contactData.tags)
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
          console.error(`Failed to create ${failed.length} contacts:`, failed);
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
      console.error("Error creating contact:", error);
      throw new Error("Failed to create contact");
    }
  }

  async update(id, contactData) {
    try {
      const apperClient = getApperClient();
      
      // Only include Updateable fields
      const payload = {
        records: [{
          Id: parseInt(id),
          name_c: contactData.name_c || contactData.name,
          email_c: contactData.email_c || contactData.email,
          company_c: contactData.company_c || contactData.company,
          phone_c: contactData.phone_c || contactData.phone,
          notes_c: contactData.notes_c || contactData.notes,
tags_c: Array.isArray(contactData.tags_c || contactData.tags) 
            ? (contactData.tags_c || contactData.tags).join(",")
            : (contactData.tags_c || contactData.tags)
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
          console.error(`Failed to update ${failed.length} contacts:`, failed);
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
      console.error(`Error updating contact ${id}:`, error);
      throw new Error("Failed to update contact");
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
          console.error(`Failed to delete ${failed.length} contacts:`, failed);
          failed.forEach(record => {
            if (record.message) {
              throw new Error(record.message);
            }
          });
        }
        
        return successful.length > 0;
      }
    } catch (error) {
      console.error(`Error deleting contact ${id}:`, error);
      throw new Error("Failed to delete contact");
    }
  }
}

export const contactService = new ContactService();