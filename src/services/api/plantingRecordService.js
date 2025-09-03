import cropService from './cropService';
import fieldService from './fieldService';

class PlantingRecordService {
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
          { field: { Name: "planting_date_c" } },
          { field: { Name: "seed_quantity_c" } },
          { field: { Name: "planting_method_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "crop_name_c" } },
          { field: { Name: "field_name_c" } },
          { field: { Name: "crop_id_c" } },
          { field: { Name: "field_id_c" } }
        ],
        orderBy: [
          {
            fieldName: "planting_date_c",
            sorttype: "DESC"
          }
        ]
      };

      const response = await this.apperClient.fetchRecords("planting_record_c", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return (response.data || []).map(record => ({
        Id: record.Id,
        cropId: record.crop_id_c?.Id || record.crop_id_c,
        fieldId: record.field_id_c?.Id || record.field_id_c,
        plantingDate: record.planting_date_c,
        seedQuantity: record.seed_quantity_c,
        plantingMethod: record.planting_method_c,
        notes: record.notes_c,
        cropName: record.crop_id_c?.Name || record.crop_name_c,
        fieldName: record.field_id_c?.Name || record.field_name_c
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching planting records:", error?.response?.data?.message);
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
          { field: { Name: "planting_date_c" } },
          { field: { Name: "seed_quantity_c" } },
          { field: { Name: "planting_method_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "crop_name_c" } },
          { field: { Name: "field_name_c" } },
          { field: { Name: "crop_id_c" } },
          { field: { Name: "field_id_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById("planting_record_c", id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      const record = response.data;
      return {
        Id: record.Id,
        cropId: record.crop_id_c?.Id || record.crop_id_c,
        fieldId: record.field_id_c?.Id || record.field_id_c,
        plantingDate: record.planting_date_c,
        seedQuantity: record.seed_quantity_c,
        plantingMethod: record.planting_method_c,
        notes: record.notes_c,
        cropName: record.crop_id_c?.Name || record.crop_name_c,
        fieldName: record.field_id_c?.Name || record.field_name_c
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching planting record with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  }

  async create(recordData) {
    try {
      // Get crop and field names for enrichment
      const crop = await cropService.getById(recordData.cropId);
      const field = await fieldService.getById(recordData.fieldId);

      const params = {
        records: [
          {
            Name: `${crop?.name} - ${field?.name} Planting`,
            planting_date_c: recordData.plantingDate,
            seed_quantity_c: parseInt(recordData.seedQuantity),
            planting_method_c: recordData.plantingMethod || 'Direct Seeding',
            notes_c: recordData.notes,
            crop_name_c: crop?.name,
            field_name_c: field?.name,
            crop_id_c: parseInt(recordData.cropId),
            field_id_c: parseInt(recordData.fieldId)
          }
        ]
      };

      const response = await this.apperClient.createRecord("planting_record_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create planting record ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
          cropId: result.data.crop_id_c,
          fieldId: result.data.field_id_c,
          plantingDate: result.data.planting_date_c,
          seedQuantity: result.data.seed_quantity_c,
          plantingMethod: result.data.planting_method_c,
          notes: result.data.notes_c,
          cropName: result.data.crop_name_c,
          fieldName: result.data.field_name_c
        }))[0];
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating planting record:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  async update(id, updates) {
    try {
      // Get existing record to preserve unchanged values
      const existingRecord = await this.getById(id);
      if (!existingRecord) {
        throw new Error('Planting record not found');
      }

      // Get updated names if crop or field changed
      let cropName = existingRecord.cropName;
      let fieldName = existingRecord.fieldName;
      
      if (updates.cropId && updates.cropId !== existingRecord.cropId) {
        const crop = await cropService.getById(updates.cropId);
        cropName = crop?.name;
      }
      
      if (updates.fieldId && updates.fieldId !== existingRecord.fieldId) {
        const field = await fieldService.getById(updates.fieldId);
        fieldName = field?.name;
      }

      const params = {
        records: [
          {
            Id: parseInt(id),
            Name: `${cropName} - ${fieldName} Planting`,
            planting_date_c: updates.plantingDate || existingRecord.plantingDate,
            seed_quantity_c: updates.seedQuantity ? parseInt(updates.seedQuantity) : existingRecord.seedQuantity,
            planting_method_c: updates.plantingMethod || existingRecord.plantingMethod,
            notes_c: updates.notes || existingRecord.notes,
            crop_name_c: cropName,
            field_name_c: fieldName,
            crop_id_c: updates.cropId ? parseInt(updates.cropId) : existingRecord.cropId,
            field_id_c: updates.fieldId ? parseInt(updates.fieldId) : existingRecord.fieldId
          }
        ]
      };

      const response = await this.apperClient.updateRecord("planting_record_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update planting record ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
          cropId: result.data.crop_id_c,
          fieldId: result.data.field_id_c,
          plantingDate: result.data.planting_date_c,
          seedQuantity: result.data.seed_quantity_c,
          plantingMethod: result.data.planting_method_c,
          notes: result.data.notes_c,
          cropName: result.data.crop_name_c,
          fieldName: result.data.field_name_c
        }))[0];
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating planting record:", error?.response?.data?.message);
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

      const response = await this.apperClient.deleteRecord("planting_record_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete planting record ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return response.results.filter(result => result.success).length === 1;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting planting record:", error?.response?.data?.message);
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
      const thisMonth = new Date();
      thisMonth.setDate(1);
      thisMonth.setHours(0, 0, 0, 0);
      
      const thisMonthRecords = records.filter(record => 
        new Date(record.plantingDate) >= thisMonth
      ).length;
      
      const uniqueCrops = new Set(records.map(record => record.cropId)).size;
      const uniqueFields = new Set(records.map(record => record.fieldId)).size;
      
      return {
        totalRecords,
        thisMonthRecords,
        uniqueCrops,
        uniqueFields
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error calculating planting record stats:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return {
        totalRecords: 0,
        thisMonthRecords: 0,
        uniqueCrops: 0,
        uniqueFields: 0
      };
    }
  }

  async getRecent(limit = 5) {
    try {
      const recentRecords = await this.getAll();
      return recentRecords.slice(0, limit);
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching recent planting records:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  }

  getPlantingMethods() {
    return [
      'Direct Seeding',
      'Transplanting',
      'Broadcasting',
      'Row Planting',
      'Hill Planting',
      'Drill Seeding',
      'No-Till',
      'Hydroponic'
    ];
  }
}

const plantingRecordService = new PlantingRecordService();
export default plantingRecordService;