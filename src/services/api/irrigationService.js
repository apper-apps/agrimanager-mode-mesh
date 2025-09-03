class IrrigationService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "date_c" } },
          { field: { Name: "duration_c" } },
          { field: { Name: "water_amount_c" } },
          { field: { Name: "irrigation_method_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "field_id_c" } }
        ],
        orderBy: [
          {
            fieldName: "date_c",
            sorttype: "DESC"
          }
        ]
      };

      const response = await this.apperClient.fetchRecords("irrigation_record_c", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return (response.data || []).map(record => ({
        Id: record.Id,
        fieldId: record.field_id_c?.Id || record.field_id_c,
        date: record.date_c,
        duration: record.duration_c,
        waterAmount: record.water_amount_c,
        irrigationMethod: record.irrigation_method_c,
        notes: record.notes_c,
        createdAt: record.created_at_c
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching irrigation records:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "date_c" } },
          { field: { Name: "duration_c" } },
          { field: { Name: "water_amount_c" } },
          { field: { Name: "irrigation_method_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "field_id_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById("irrigation_record_c", id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      const record = response.data;
      return {
        Id: record.Id,
        fieldId: record.field_id_c?.Id || record.field_id_c,
        date: record.date_c,
        duration: record.duration_c,
        waterAmount: record.water_amount_c,
        irrigationMethod: record.irrigation_method_c,
        notes: record.notes_c,
        createdAt: record.created_at_c
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching irrigation record with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  }

  async getByFieldId(fieldId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "date_c" } },
          { field: { Name: "duration_c" } },
          { field: { Name: "water_amount_c" } },
          { field: { Name: "irrigation_method_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "field_id_c" } }
        ],
        where: [
          {
            FieldName: "field_id_c",
            Operator: "EqualTo",
            Values: [parseInt(fieldId)]
          }
        ],
        orderBy: [
          {
            fieldName: "date_c",
            sorttype: "DESC"
          }
        ]
      };

      const response = await this.apperClient.fetchRecords("irrigation_record_c", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return (response.data || []).map(record => ({
        Id: record.Id,
        fieldId: record.field_id_c?.Id || record.field_id_c,
        date: record.date_c,
        duration: record.duration_c,
        waterAmount: record.water_amount_c,
        irrigationMethod: record.irrigation_method_c,
        notes: record.notes_c,
        createdAt: record.created_at_c
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching irrigation records by field:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  }

  async create(recordData) {
    try {
      const params = {
        records: [
          {
            Name: `Irrigation - ${new Date(recordData.date).toLocaleDateString()}`,
            date_c: recordData.date,
            duration_c: parseInt(recordData.duration),
            water_amount_c: parseInt(recordData.waterAmount),
            irrigation_method_c: recordData.irrigationMethod,
            notes_c: recordData.notes,
            created_at_c: new Date().toISOString(),
            field_id_c: parseInt(recordData.fieldId)
          }
        ]
      };

      const response = await this.apperClient.createRecord("irrigation_record_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create irrigation record ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords.map(result => ({
          Id: result.data.Id,
          fieldId: result.data.field_id_c,
          date: result.data.date_c,
          duration: result.data.duration_c,
          waterAmount: result.data.water_amount_c,
          irrigationMethod: result.data.irrigation_method_c,
          notes: result.data.notes_c,
          createdAt: result.data.created_at_c
        }))[0];
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating irrigation record:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  async update(id, recordData) {
    try {
      const params = {
        records: [
          {
            Id: parseInt(id),
            Name: `Irrigation - ${new Date(recordData.date).toLocaleDateString()}`,
            date_c: recordData.date,
            duration_c: parseInt(recordData.duration),
            water_amount_c: parseInt(recordData.waterAmount),
            irrigation_method_c: recordData.irrigationMethod,
            notes_c: recordData.notes,
            field_id_c: parseInt(recordData.fieldId)
          }
        ]
      };

      const response = await this.apperClient.updateRecord("irrigation_record_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update irrigation record ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords.map(result => ({
          Id: result.data.Id,
          fieldId: result.data.field_id_c,
          date: result.data.date_c,
          duration: result.data.duration_c,
          waterAmount: result.data.water_amount_c,
          irrigationMethod: result.data.irrigation_method_c,
          notes: result.data.notes_c,
          createdAt: result.data.created_at_c
        }))[0];
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating irrigation record:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord("irrigation_record_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete irrigation record ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return response.results.filter(result => result.success).length === 1;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting irrigation record:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  async getStats() {
    try {
      const records = await this.getAll();
      const totalRecords = records.length;
      const totalWaterUsed = records.reduce((sum, record) => sum + (record.waterAmount || 0), 0);
      const averageWaterPerIrrigation = totalRecords > 0 ? totalWaterUsed / totalRecords : 0;
      
      return {
        totalRecords,
        totalWaterUsed,
        averageWaterPerIrrigation
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error calculating irrigation stats:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return {
        totalRecords: 0,
        totalWaterUsed: 0,
        averageWaterPerIrrigation: 0
      };
    }
  }
}

const irrigationService = new IrrigationService();
export default irrigationService;