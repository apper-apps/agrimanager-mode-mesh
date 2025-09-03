import React from "react";
import Error from "@/components/ui/Error";
class CropService {
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
          { field: { Name: "variety_c" } },
          { field: { Name: "field_name_c" } },
          { field: { Name: "planting_date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "estimated_harvest_c" } },
          { field: { Name: "growth_stage_c" } },
          { field: { Name: "stage_history_c" } },
          { field: { Name: "field_id_c" } }
        ]
      };

      const response = await this.apperClient.fetchRecords("crop_c", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return (response.data || []).map(crop => ({
        Id: crop.Id,
        name: crop.Name,
        variety: crop.variety_c,
        fieldId: crop.field_id_c?.Id || crop.field_id_c,
        fieldName: crop.field_id_c?.Name || crop.field_name_c,
        plantingDate: crop.planting_date_c,
        status: crop.status_c,
        estimatedHarvest: crop.estimated_harvest_c,
        growthStage: crop.growth_stage_c || "Planted",
        stageHistory: crop.stage_history_c ? JSON.parse(crop.stage_history_c) : []
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching crops:", error?.response?.data?.message);
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
          { field: { Name: "variety_c" } },
          { field: { Name: "field_name_c" } },
          { field: { Name: "planting_date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "estimated_harvest_c" } },
          { field: { Name: "growth_stage_c" } },
          { field: { Name: "stage_history_c" } },
          { field: { Name: "field_id_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById("crop_c", id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      const crop = response.data;
      return {
        Id: crop.Id,
        name: crop.Name,
        variety: crop.variety_c,
        fieldId: crop.field_id_c?.Id || crop.field_id_c,
        fieldName: crop.field_id_c?.Name || crop.field_name_c,
        plantingDate: crop.planting_date_c,
        status: crop.status_c,
        estimatedHarvest: crop.estimated_harvest_c,
        growthStage: crop.growth_stage_c || "Planted",
        stageHistory: crop.stage_history_c ? JSON.parse(crop.stage_history_c) : []
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching crop with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  }

  async create(cropData) {
    try {
      const plantingDate = cropData.plantingDate || new Date().toISOString();
      const stageHistory = [{
        stage: "Planted",
        date: plantingDate,
        updatedAt: new Date().toISOString()
      }];

      const params = {
        records: [
          {
            Name: cropData.name,
            variety_c: cropData.variety,
            field_name_c: cropData.fieldName,
            planting_date_c: plantingDate,
            status_c: cropData.status || "growing",
            estimated_harvest_c: cropData.estimatedHarvest,
            growth_stage_c: "Planted",
            stage_history_c: JSON.stringify(stageHistory),
            field_id_c: parseInt(cropData.fieldId)
          }
        ]
      };

      const response = await this.apperClient.createRecord("crop_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create crop ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
          name: result.data.Name,
          variety: result.data.variety_c,
          fieldId: result.data.field_id_c,
          fieldName: result.data.field_name_c,
          plantingDate: result.data.planting_date_c,
          status: result.data.status_c,
          estimatedHarvest: result.data.estimated_harvest_c,
          growthStage: result.data.growth_stage_c,
          stageHistory: result.data.stage_history_c ? JSON.parse(result.data.stage_history_c) : []
        }))[0];
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating crop:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  async update(id, cropData) {
    try {
      // Get existing crop to handle stage history
      const existingCrop = await this.getById(id);
      if (!existingCrop) {
        throw new Error("Crop not found");
      }

      let stageHistory = existingCrop.stageHistory || [];
      
      // Handle growth stage updates
      if (cropData.growthStage && cropData.growthStage !== existingCrop.growthStage) {
        stageHistory = [
          ...stageHistory,
          {
            stage: cropData.growthStage,
            date: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ];
      }

      const params = {
        records: [
          {
            Id: parseInt(id),
            Name: cropData.name || existingCrop.name,
            variety_c: cropData.variety || existingCrop.variety,
            field_name_c: cropData.fieldName || existingCrop.fieldName,
            planting_date_c: cropData.plantingDate || existingCrop.plantingDate,
            status_c: cropData.status || existingCrop.status,
            estimated_harvest_c: cropData.estimatedHarvest || existingCrop.estimatedHarvest,
            growth_stage_c: cropData.growthStage || existingCrop.growthStage,
            stage_history_c: JSON.stringify(stageHistory),
            field_id_c: cropData.fieldId ? parseInt(cropData.fieldId) : existingCrop.fieldId
          }
        ]
      };

      const response = await this.apperClient.updateRecord("crop_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update crop ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
          name: result.data.Name,
          variety: result.data.variety_c,
          fieldId: result.data.field_id_c,
          fieldName: result.data.field_name_c,
          plantingDate: result.data.planting_date_c,
          status: result.data.status_c,
          estimatedHarvest: result.data.estimated_harvest_c,
          growthStage: result.data.growth_stage_c,
          stageHistory: result.data.stage_history_c ? JSON.parse(result.data.stage_history_c) : []
        }))[0];
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating crop:", error?.response?.data?.message);
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

      const response = await this.apperClient.deleteRecord("crop_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete crop ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return response.results.filter(result => result.success).length === 1;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting crop:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  async getStats() {
    try {
      const crops = await this.getAll();
      const totalCrops = crops.length;
      const activeCrops = crops.filter(c => c.status === "growing" || c.status === "planted").length;
      const readyToHarvest = crops.filter(c => c.status === "ready").length;
      const harvested = crops.filter(c => c.status === "harvested").length;

      return {
        totalCrops,
        activeCrops,
        readyToHarvest,
        harvested
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error calculating crop stats:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return {
        totalCrops: 0,
        activeCrops: 0,
        readyToHarvest: 0,
        harvested: 0
      };
    }
  }
}

const cropService = new CropService();
export default cropService;