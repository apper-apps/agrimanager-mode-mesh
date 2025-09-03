class PestMonitoringService {
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
          { field: { Name: "field_id_c" } },
          { field: { Name: "crop_id_c" } },
          { field: { Name: "pest_type_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "severity_level_c" } },
          { field: { Name: "affected_area_c" } },
          { field: { Name: "affected_area_unit_c" } },
          { field: { Name: "observation_date_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "treatment_applied_c" } },
          { field: { Name: "treatment_date_c" } },
          { field: { Name: "treatment_cost_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "photos_c" } },
          { field: { Name: "weather_conditions_c" } },
          { field: { Name: "observed_by_c" } },
          { field: { Name: "follow_up_required_c" } },
          { field: { Name: "follow_up_date_c" } },
          { field: { Name: "notes_c" } }
        ],
        orderBy: [
          {
            fieldName: "observation_date_c",
            sorttype: "DESC"
          }
        ]
      };

      const response = await this.apperClient.fetchRecords("pest_observation_c", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return (response.data || []).map(observation => ({
        Id: observation.Id,
        fieldId: observation.field_id_c?.Id || observation.field_id_c,
        cropId: observation.crop_id_c?.Id || observation.crop_id_c,
        pestType: observation.pest_type_c,
        category: observation.category_c,
        severityLevel: observation.severity_level_c,
        affectedArea: observation.affected_area_c,
        affectedAreaUnit: observation.affected_area_unit_c,
        observationDate: observation.observation_date_c,
        description: observation.description_c,
        treatmentApplied: observation.treatment_applied_c,
        treatmentDate: observation.treatment_date_c,
        treatmentCost: observation.treatment_cost_c,
        status: observation.status_c,
        photos: observation.photos_c ? JSON.parse(observation.photos_c) : [],
        weatherConditions: observation.weather_conditions_c,
        observedBy: observation.observed_by_c,
        followUpRequired: observation.follow_up_required_c,
        followUpDate: observation.follow_up_date_c,
        notes: observation.notes_c
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching pest observations:", error?.response?.data?.message);
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
          { field: { Name: "field_id_c" } },
          { field: { Name: "crop_id_c" } },
          { field: { Name: "pest_type_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "severity_level_c" } },
          { field: { Name: "affected_area_c" } },
          { field: { Name: "affected_area_unit_c" } },
          { field: { Name: "observation_date_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "treatment_applied_c" } },
          { field: { Name: "treatment_date_c" } },
          { field: { Name: "treatment_cost_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "photos_c" } },
          { field: { Name: "weather_conditions_c" } },
          { field: { Name: "observed_by_c" } },
          { field: { Name: "follow_up_required_c" } },
          { field: { Name: "follow_up_date_c" } },
          { field: { Name: "notes_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById("pest_observation_c", id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      const observation = response.data;
      return {
        Id: observation.Id,
        fieldId: observation.field_id_c?.Id || observation.field_id_c,
        cropId: observation.crop_id_c?.Id || observation.crop_id_c,
        pestType: observation.pest_type_c,
        category: observation.category_c,
        severityLevel: observation.severity_level_c,
        affectedArea: observation.affected_area_c,
        affectedAreaUnit: observation.affected_area_unit_c,
        observationDate: observation.observation_date_c,
        description: observation.description_c,
        treatmentApplied: observation.treatment_applied_c,
        treatmentDate: observation.treatment_date_c,
        treatmentCost: observation.treatment_cost_c,
        status: observation.status_c,
        photos: observation.photos_c ? JSON.parse(observation.photos_c) : [],
        weatherConditions: observation.weather_conditions_c,
        observedBy: observation.observed_by_c,
        followUpRequired: observation.follow_up_required_c,
        followUpDate: observation.follow_up_date_c,
        notes: observation.notes_c
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching pest observation with ID ${id}:`, error?.response?.data?.message);
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
          { field: { Name: "field_id_c" } },
          { field: { Name: "crop_id_c" } },
          { field: { Name: "pest_type_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "severity_level_c" } },
          { field: { Name: "affected_area_c" } },
          { field: { Name: "affected_area_unit_c" } },
          { field: { Name: "observation_date_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "treatment_applied_c" } },
          { field: { Name: "treatment_date_c" } },
          { field: { Name: "treatment_cost_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "photos_c" } },
          { field: { Name: "weather_conditions_c" } },
          { field: { Name: "observed_by_c" } },
          { field: { Name: "follow_up_required_c" } },
          { field: { Name: "follow_up_date_c" } },
          { field: { Name: "notes_c" } }
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
            fieldName: "observation_date_c",
            sorttype: "DESC"
          }
        ]
      };

      const response = await this.apperClient.fetchRecords("pest_observation_c", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return (response.data || []).map(observation => ({
        Id: observation.Id,
        fieldId: observation.field_id_c?.Id || observation.field_id_c,
        cropId: observation.crop_id_c?.Id || observation.crop_id_c,
        pestType: observation.pest_type_c,
        category: observation.category_c,
        severityLevel: observation.severity_level_c,
        affectedArea: observation.affected_area_c,
        affectedAreaUnit: observation.affected_area_unit_c,
        observationDate: observation.observation_date_c,
        description: observation.description_c,
        treatmentApplied: observation.treatment_applied_c,
        treatmentDate: observation.treatment_date_c,
        treatmentCost: observation.treatment_cost_c,
        status: observation.status_c,
        photos: observation.photos_c ? JSON.parse(observation.photos_c) : [],
        weatherConditions: observation.weather_conditions_c,
        observedBy: observation.observed_by_c,
        followUpRequired: observation.follow_up_required_c,
        followUpDate: observation.follow_up_date_c,
        notes: observation.notes_c
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching pest observations by field:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  }

  async create(observationData) {
    try {
      const params = {
        records: [
          {
            Name: `${observationData.pestType} - ${observationData.category}`,
            field_id_c: parseInt(observationData.fieldId),
            crop_id_c: observationData.cropId ? parseInt(observationData.cropId) : null,
            pest_type_c: observationData.pestType,
            category_c: observationData.category,
            severity_level_c: parseInt(observationData.severityLevel),
            affected_area_c: parseFloat(observationData.affectedArea),
            affected_area_unit_c: observationData.affectedAreaUnit || 'acres',
            observation_date_c: observationData.observationDate || new Date().toISOString(),
            description_c: observationData.description,
            treatment_applied_c: observationData.treatmentApplied,
            treatment_date_c: observationData.treatmentDate,
            treatment_cost_c: observationData.treatmentCost ? parseFloat(observationData.treatmentCost) : null,
            status_c: observationData.status || 'Active',
            photos_c: observationData.photos ? JSON.stringify(observationData.photos) : null,
            weather_conditions_c: observationData.weatherConditions,
            observed_by_c: observationData.observedBy || 'Farm Manager',
            follow_up_required_c: observationData.followUpRequired || false,
            follow_up_date_c: observationData.followUpDate,
            notes_c: observationData.notes
          }
        ]
      };

      const response = await this.apperClient.createRecord("pest_observation_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create pest observation ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
          pestType: result.data.pest_type_c,
          category: result.data.category_c,
          severityLevel: result.data.severity_level_c,
          affectedArea: result.data.affected_area_c,
          affectedAreaUnit: result.data.affected_area_unit_c,
          observationDate: result.data.observation_date_c,
          description: result.data.description_c,
          treatmentApplied: result.data.treatment_applied_c,
          treatmentDate: result.data.treatment_date_c,
          treatmentCost: result.data.treatment_cost_c,
          status: result.data.status_c,
          photos: result.data.photos_c ? JSON.parse(result.data.photos_c) : [],
          weatherConditions: result.data.weather_conditions_c,
          observedBy: result.data.observed_by_c,
          followUpRequired: result.data.follow_up_required_c,
          followUpDate: result.data.follow_up_date_c,
          notes: result.data.notes_c
        }))[0];
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating pest observation:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  async update(id, observationData) {
    try {
      const params = {
        records: [
          {
            Id: parseInt(id),
            Name: `${observationData.pestType} - ${observationData.category}`,
            field_id_c: parseInt(observationData.fieldId),
            crop_id_c: observationData.cropId ? parseInt(observationData.cropId) : null,
            pest_type_c: observationData.pestType,
            category_c: observationData.category,
            severity_level_c: parseInt(observationData.severityLevel),
            affected_area_c: parseFloat(observationData.affectedArea),
            affected_area_unit_c: observationData.affectedAreaUnit || 'acres',
            observation_date_c: observationData.observationDate,
            description_c: observationData.description,
            treatment_applied_c: observationData.treatmentApplied,
            treatment_date_c: observationData.treatmentDate,
            treatment_cost_c: observationData.treatmentCost ? parseFloat(observationData.treatmentCost) : null,
            status_c: observationData.status,
            photos_c: observationData.photos ? JSON.stringify(observationData.photos) : null,
            weather_conditions_c: observationData.weatherConditions,
            observed_by_c: observationData.observedBy,
            follow_up_required_c: observationData.followUpRequired,
            follow_up_date_c: observationData.followUpDate,
            notes_c: observationData.notes
          }
        ]
      };

      const response = await this.apperClient.updateRecord("pest_observation_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update pest observation ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
          pestType: result.data.pest_type_c,
          category: result.data.category_c,
          severityLevel: result.data.severity_level_c,
          affectedArea: result.data.affected_area_c,
          affectedAreaUnit: result.data.affected_area_unit_c,
          observationDate: result.data.observation_date_c,
          description: result.data.description_c,
          treatmentApplied: result.data.treatment_applied_c,
          treatmentDate: result.data.treatment_date_c,
          treatmentCost: result.data.treatment_cost_c,
          status: result.data.status_c,
          photos: result.data.photos_c ? JSON.parse(result.data.photos_c) : [],
          weatherConditions: result.data.weather_conditions_c,
          observedBy: result.data.observed_by_c,
          followUpRequired: result.data.follow_up_required_c,
          followUpDate: result.data.follow_up_date_c,
          notes: result.data.notes_c
        }))[0];
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating pest observation:", error?.response?.data?.message);
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

      const response = await this.apperClient.deleteRecord("pest_observation_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete pest observation ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return response.results.filter(result => result.success).length === 1;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting pest observation:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  async getStats() {
    try {
      const observations = await this.getAll();
      
      const totalObservations = observations.length;
      const activeIssues = observations.filter(o => o.status === 'Active').length;
      const resolvedIssues = observations.filter(o => o.status === 'Resolved').length;
      const monitoringIssues = observations.filter(o => o.status === 'Monitoring').length;
      
      const avgSeverity = totalObservations > 0 
        ? Math.round((observations.reduce((sum, o) => sum + (o.severityLevel || 0), 0) / totalObservations) * 10) / 10
        : 0;

      const totalTreatmentCost = observations.reduce((sum, o) => sum + (o.treatmentCost || 0), 0);
      const totalAffectedArea = observations.reduce((sum, o) => sum + (o.affectedArea || 0), 0);

      return {
        totalObservations,
        activeIssues,
        resolvedIssues,
        monitoringIssues,
        avgSeverity,
        totalTreatmentCost: Math.round(totalTreatmentCost * 100) / 100,
        totalAffectedArea: Math.round(totalAffectedArea * 10) / 10
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
        monitoringIssues: 0,
        avgSeverity: 0,
        totalTreatmentCost: 0,
        totalAffectedArea: 0
      };
    }
  }

  async getPestTypes() {
    // Return static data for pest types - this doesn't need to be dynamic from database
    const pestTypes = [
      { category: 'Pest', types: ['Aphids', 'Cutworm', 'Corn Borer', 'Thrips', 'Spider Mites', 'Whiteflies', 'Caterpillars', 'Beetles'] },
      { category: 'Disease', types: ['Powdery Mildew', 'Leaf Spot', 'Rust', 'Blight', 'Root Rot', 'Wilt', 'Mosaic Virus', 'Anthracnose'] },
      { category: 'Weed', types: ['Pigweed', 'Lambsquarters', 'Foxtail', 'Bindweed', 'Thistle', 'Dandelion', 'Crabgrass', 'Johnson Grass'] }
    ];
    
    return pestTypes;
  }
}

const pestMonitoringService = new PestMonitoringService();
export default pestMonitoringService;
