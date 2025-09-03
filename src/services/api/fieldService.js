class FieldService {
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
          { field: { Name: "size_in_acres_c" } },
          { field: { Name: "location_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "created_at_c" } }
        ]
      };

      const response = await this.apperClient.fetchRecords("field_c", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return (response.data || []).map(field => ({
        Id: field.Id,
        name: field.Name,
        sizeInAcres: field.size_in_acres_c,
        location: field.location_c,
        status: field.status_c,
        createdAt: field.created_at_c
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching fields:", error?.response?.data?.message);
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
          { field: { Name: "size_in_acres_c" } },
          { field: { Name: "location_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "created_at_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById("field_c", id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      const field = response.data;
      return {
        Id: field.Id,
        name: field.Name,
        sizeInAcres: field.size_in_acres_c,
        location: field.location_c,
        status: field.status_c,
        createdAt: field.created_at_c
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching field with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  }

  async create(fieldData) {
    try {
      const params = {
        records: [
          {
            Name: fieldData.name,
            size_in_acres_c: parseFloat(fieldData.sizeInAcres),
            location_c: fieldData.location,
            status_c: fieldData.status,
            created_at_c: new Date().toISOString()
          }
        ]
      };

      const response = await this.apperClient.createRecord("field_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create field ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
          sizeInAcres: result.data.size_in_acres_c,
          location: result.data.location_c,
          status: result.data.status_c,
          createdAt: result.data.created_at_c
        }))[0];
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating field:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  async update(id, fieldData) {
    try {
      const params = {
        records: [
          {
            Id: parseInt(id),
            Name: fieldData.name,
            size_in_acres_c: parseFloat(fieldData.sizeInAcres),
            location_c: fieldData.location,
            status_c: fieldData.status
          }
        ]
      };

      const response = await this.apperClient.updateRecord("field_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update field ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
          sizeInAcres: result.data.size_in_acres_c,
          location: result.data.location_c,
          status: result.data.status_c,
          createdAt: result.data.created_at_c
        }))[0];
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating field:", error?.response?.data?.message);
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

      const response = await this.apperClient.deleteRecord("field_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete field ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return response.results.filter(result => result.success).length === 1;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting field:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  async getIrrigationStats(fieldId) {
try {
      // This could fetch irrigation stats for the field from irrigation_record_c table
      // For now, return default structure
      const defaultStats = {
        totalIrrigations: 0,
        totalWaterUsed: 0,
        lastIrrigation: null
      };
      return defaultStats;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error calculating irrigation stats:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return {
        totalIrrigations: 0,
        totalWaterUsed: 0,
        lastIrrigation: null
      };
    }
  }

  async getStats() {
    try {
      const fields = await this.getAll();
      const totalFields = fields.length;
      const activeFields = fields.filter(f => f.status === "active").length;
      const totalAcres = fields.reduce((sum, f) => sum + (f.sizeInAcres || 0), 0);
      const fallowFields = fields.filter(f => f.status === "fallow").length;

      return {
        totalFields,
        activeFields,
        totalAcres: Math.round(totalAcres * 10) / 10,
        fallowFields
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error calculating field stats:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return {
        totalFields: 0,
        activeFields: 0,
        totalAcres: 0,
        fallowFields: 0
      };
    }
  }

  async getPestMonitoringStats() {
    try {
      // Import pest monitoring service dynamically to avoid circular dependency
      const { default: pestMonitoringService } = await import('./pestMonitoringService');
      const observations = await pestMonitoringService.getAll();
      
      const totalObservations = observations.length;
      const activeIssues = observations.filter(o => o.status === 'Active').length;
      const resolvedIssues = observations.filter(o => o.status === 'Resolved').length;
      const avgSeverity = observations.length > 0 
        ? Math.round((observations.reduce((sum, o) => sum + (o.severityLevel || 0), 0) / observations.length) * 10) / 10
        : 0;

      return {
        totalObservations,
        activeIssues,
        resolvedIssues,
        avgSeverity
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error calculating pest monitoring stats:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return {
        totalObservations: 0,
        activeIssues: 0,
        resolvedIssues: 0,
        avgSeverity: 0
      };
    }
  }
}

const fieldService = new FieldService();
export default fieldService;