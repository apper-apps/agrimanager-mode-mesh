class FertilizerService {
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
          { field: { Name: "fertilizer_type_c" } },
          { field: { Name: "application_date_c" } },
          { field: { Name: "quantity_used_c" } },
          { field: { Name: "unit_c" } },
          { field: { Name: "cost_per_unit_c" } },
          { field: { Name: "total_cost_c" } },
          { field: { Name: "application_method_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "field_id_c" } },
          { field: { Name: "crop_id_c" } }
        ],
        orderBy: [
          {
            fieldName: "application_date_c",
            sorttype: "DESC"
          }
        ]
      };

      const response = await this.apperClient.fetchRecords("fertilizer_record_c", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return (response.data || []).map(record => ({
        Id: record.Id,
        fieldId: record.field_id_c?.Id || record.field_id_c,
        cropId: record.crop_id_c?.Id || record.crop_id_c,
        fertilizerType: record.fertilizer_type_c,
        applicationDate: record.application_date_c,
        quantityUsed: record.quantity_used_c,
        unit: record.unit_c,
        costPerUnit: record.cost_per_unit_c,
        totalCost: record.total_cost_c,
        applicationMethod: record.application_method_c,
        notes: record.notes_c,
        createdAt: record.created_at_c
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching fertilizer records:", error?.response?.data?.message);
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
          { field: { Name: "fertilizer_type_c" } },
          { field: { Name: "application_date_c" } },
          { field: { Name: "quantity_used_c" } },
          { field: { Name: "unit_c" } },
          { field: { Name: "cost_per_unit_c" } },
          { field: { Name: "total_cost_c" } },
          { field: { Name: "application_method_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "field_id_c" } },
          { field: { Name: "crop_id_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById("fertilizer_record_c", id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      const record = response.data;
      return {
        Id: record.Id,
        fieldId: record.field_id_c?.Id || record.field_id_c,
        cropId: record.crop_id_c?.Id || record.crop_id_c,
        fertilizerType: record.fertilizer_type_c,
        applicationDate: record.application_date_c,
        quantityUsed: record.quantity_used_c,
        unit: record.unit_c,
        costPerUnit: record.cost_per_unit_c,
        totalCost: record.total_cost_c,
        applicationMethod: record.application_method_c,
        notes: record.notes_c,
        createdAt: record.created_at_c
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching fertilizer record with ID ${id}:`, error?.response?.data?.message);
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
          { field: { Name: "fertilizer_type_c" } },
          { field: { Name: "application_date_c" } },
          { field: { Name: "quantity_used_c" } },
          { field: { Name: "unit_c" } },
          { field: { Name: "cost_per_unit_c" } },
          { field: { Name: "total_cost_c" } },
          { field: { Name: "application_method_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "field_id_c" } },
          { field: { Name: "crop_id_c" } }
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
            fieldName: "application_date_c",
            sorttype: "DESC"
          }
        ]
      };

      const response = await this.apperClient.fetchRecords("fertilizer_record_c", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return (response.data || []).map(record => ({
        Id: record.Id,
        fieldId: record.field_id_c?.Id || record.field_id_c,
        cropId: record.crop_id_c?.Id || record.crop_id_c,
        fertilizerType: record.fertilizer_type_c,
        applicationDate: record.application_date_c,
        quantityUsed: record.quantity_used_c,
        unit: record.unit_c,
        costPerUnit: record.cost_per_unit_c,
        totalCost: record.total_cost_c,
        applicationMethod: record.application_method_c,
        notes: record.notes_c,
        createdAt: record.created_at_c
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching fertilizer records by field:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  }

  async create(recordData) {
    try {
      const totalCost = parseFloat(recordData.quantityUsed) * parseFloat(recordData.costPerUnit);
      
      const params = {
        records: [
          {
            Name: `${recordData.fertilizerType} Application`,
            fertilizer_type_c: recordData.fertilizerType,
            application_date_c: recordData.applicationDate,
            quantity_used_c: parseInt(recordData.quantityUsed),
            unit_c: recordData.unit,
            cost_per_unit_c: parseFloat(recordData.costPerUnit),
            total_cost_c: Math.round(totalCost * 100) / 100,
            application_method_c: recordData.applicationMethod,
            notes_c: recordData.notes,
            created_at_c: new Date().toISOString(),
            field_id_c: parseInt(recordData.fieldId),
            crop_id_c: recordData.cropId ? parseInt(recordData.cropId) : null
          }
        ]
      };

      const response = await this.apperClient.createRecord("fertilizer_record_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create fertilizer record ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
          cropId: result.data.crop_id_c,
          fertilizerType: result.data.fertilizer_type_c,
          applicationDate: result.data.application_date_c,
          quantityUsed: result.data.quantity_used_c,
          unit: result.data.unit_c,
          costPerUnit: result.data.cost_per_unit_c,
          totalCost: result.data.total_cost_c,
          applicationMethod: result.data.application_method_c,
          notes: result.data.notes_c,
          createdAt: result.data.created_at_c
        }))[0];
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating fertilizer record:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  async update(id, recordData) {
    try {
      const totalCost = parseFloat(recordData.quantityUsed) * parseFloat(recordData.costPerUnit);
      
      const params = {
        records: [
          {
            Id: parseInt(id),
            Name: `${recordData.fertilizerType} Application`,
            fertilizer_type_c: recordData.fertilizerType,
            application_date_c: recordData.applicationDate,
            quantity_used_c: parseInt(recordData.quantityUsed),
            unit_c: recordData.unit,
            cost_per_unit_c: parseFloat(recordData.costPerUnit),
            total_cost_c: Math.round(totalCost * 100) / 100,
            application_method_c: recordData.applicationMethod,
            notes_c: recordData.notes,
            field_id_c: parseInt(recordData.fieldId),
            crop_id_c: recordData.cropId ? parseInt(recordData.cropId) : null
          }
        ]
      };

      const response = await this.apperClient.updateRecord("fertilizer_record_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update fertilizer record ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
          cropId: result.data.crop_id_c,
          fertilizerType: result.data.fertilizer_type_c,
          applicationDate: result.data.application_date_c,
          quantityUsed: result.data.quantity_used_c,
          unit: result.data.unit_c,
          costPerUnit: result.data.cost_per_unit_c,
          totalCost: result.data.total_cost_c,
          applicationMethod: result.data.application_method_c,
          notes: result.data.notes_c,
          createdAt: result.data.created_at_c
        }))[0];
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating fertilizer record:", error?.response?.data?.message);
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

      const response = await this.apperClient.deleteRecord("fertilizer_record_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete fertilizer record ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return response.results.filter(result => result.success).length === 1;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting fertilizer record:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  async getStats() {
    try {
      const records = await this.getAll();
      const totalApplications = records.length;
      const totalCost = records.reduce((sum, r) => sum + (r.totalCost || 0), 0);
      const avgCostPerApplication = totalApplications > 0 ? totalCost / totalApplications : 0;
      
      const fertilizerTypes = [...new Set(records.map(r => r.fertilizerType))];
      
      return {
        totalApplications,
        totalCost: Math.round(totalCost * 100) / 100,
        avgCostPerApplication: Math.round(avgCostPerApplication * 100) / 100,
        uniqueFertilizerTypes: fertilizerTypes.length
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error calculating fertilizer stats:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return {
        totalApplications: 0,
        totalCost: 0,
        avgCostPerApplication: 0,
        uniqueFertilizerTypes: 0
      };
    }
  }

  getFertilizerTypes() {
    return [
      "Nitrogen (Urea)",
      "NPK 10-10-10",
      "NPK 15-15-15",
      "NPK 20-20-20",
      "Phosphorus (DAP)",
      "Potassium (Muriate)",
      "Organic Compost",
      "Liquid Fertilizer"
    ];
  }
}

const fertilizerService = new FertilizerService();
export default fertilizerService;

export default new FertilizerService();