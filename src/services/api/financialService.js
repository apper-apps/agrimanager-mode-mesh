class FinancialService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  async getAllExpenses() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "category_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "amount_c" } },
          { field: { Name: "quantity_c" } },
          { field: { Name: "unit_c" } },
          { field: { Name: "price_per_unit_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "supplier_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "field_name_c" } },
          { field: { Name: "crop_name_c" } },
          { field: { Name: "field_id_c" } },
          { field: { Name: "crop_id_c" } }
        ],
        orderBy: [
          {
            fieldName: "date_c",
            sorttype: "DESC"
          }
        ]
      };

      const response = await this.apperClient.fetchRecords("expense_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return (response.data || []).map(expense => ({
        Id: expense.Id,
        category: expense.category_c,
        description: expense.description_c,
        amount: expense.amount_c,
        quantity: expense.quantity_c,
        unit: expense.unit_c,
        pricePerUnit: expense.price_per_unit_c,
        date: expense.date_c,
        supplier: expense.supplier_c,
        notes: expense.notes_c,
        fieldName: expense.field_id_c?.Name || expense.field_name_c || 'Unknown Field',
        cropName: expense.crop_id_c?.Name || expense.crop_name_c || 'N/A',
        fieldId: expense.field_id_c?.Id || expense.field_id_c,
        cropId: expense.crop_id_c?.Id || expense.crop_id_c
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching expenses:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  }

  async getExpenseById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "category_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "amount_c" } },
          { field: { Name: "quantity_c" } },
          { field: { Name: "unit_c" } },
          { field: { Name: "price_per_unit_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "supplier_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "field_name_c" } },
          { field: { Name: "crop_name_c" } },
          { field: { Name: "field_id_c" } },
          { field: { Name: "crop_id_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById("expense_c", id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      const expense = response.data;
      return {
        Id: expense.Id,
        category: expense.category_c,
        description: expense.description_c,
        amount: expense.amount_c,
        quantity: expense.quantity_c,
        unit: expense.unit_c,
        pricePerUnit: expense.price_per_unit_c,
        date: expense.date_c,
        supplier: expense.supplier_c,
        notes: expense.notes_c,
        fieldName: expense.field_id_c?.Name || expense.field_name_c || 'Unknown Field',
        cropName: expense.crop_id_c?.Name || expense.crop_name_c || 'N/A',
        fieldId: expense.field_id_c?.Id || expense.field_id_c,
        cropId: expense.crop_id_c?.Id || expense.crop_id_c
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching expense with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  }

  async createExpense(expenseData) {
    try {
      const params = {
        records: [
          {
            Name: expenseData.description || "Expense Record",
            category_c: expenseData.category,
            description_c: expenseData.description,
            amount_c: parseFloat(expenseData.amount),
            quantity_c: expenseData.quantity ? parseFloat(expenseData.quantity) : null,
            unit_c: expenseData.unit,
            price_per_unit_c: expenseData.pricePerUnit ? parseFloat(expenseData.pricePerUnit) : null,
            date_c: expenseData.date,
            supplier_c: expenseData.supplier,
            notes_c: expenseData.notes,
            field_name_c: expenseData.fieldName,
            crop_name_c: expenseData.cropName,
            field_id_c: expenseData.fieldId ? parseInt(expenseData.fieldId) : null,
            crop_id_c: expenseData.cropId ? parseInt(expenseData.cropId) : null
          }
        ]
      };

      const response = await this.apperClient.createRecord("expense_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create expense ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
          category: result.data.category_c,
          description: result.data.description_c,
          amount: result.data.amount_c,
          quantity: result.data.quantity_c,
          unit: result.data.unit_c,
          pricePerUnit: result.data.price_per_unit_c,
          date: result.data.date_c,
          supplier: result.data.supplier_c,
          notes: result.data.notes_c,
          fieldName: result.data.field_name_c,
          cropName: result.data.crop_name_c,
          fieldId: result.data.field_id_c,
          cropId: result.data.crop_id_c
        }))[0];
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating expense:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  async updateExpense(id, expenseData) {
    try {
      const params = {
        records: [
          {
            Id: parseInt(id),
            Name: expenseData.description || "Expense Record",
            category_c: expenseData.category,
            description_c: expenseData.description,
            amount_c: parseFloat(expenseData.amount),
            quantity_c: expenseData.quantity ? parseFloat(expenseData.quantity) : null,
            unit_c: expenseData.unit,
            price_per_unit_c: expenseData.pricePerUnit ? parseFloat(expenseData.pricePerUnit) : null,
            date_c: expenseData.date,
            supplier_c: expenseData.supplier,
            notes_c: expenseData.notes,
            field_name_c: expenseData.fieldName,
            crop_name_c: expenseData.cropName,
            field_id_c: expenseData.fieldId ? parseInt(expenseData.fieldId) : null,
            crop_id_c: expenseData.cropId ? parseInt(expenseData.cropId) : null
          }
        ]
      };

      const response = await this.apperClient.updateRecord("expense_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update expense ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
          category: result.data.category_c,
          description: result.data.description_c,
          amount: result.data.amount_c,
          quantity: result.data.quantity_c,
          unit: result.data.unit_c,
          pricePerUnit: result.data.price_per_unit_c,
          date: result.data.date_c,
          supplier: result.data.supplier_c,
          notes: result.data.notes_c,
          fieldName: result.data.field_name_c,
          cropName: result.data.crop_name_c,
          fieldId: result.data.field_id_c,
          cropId: result.data.crop_id_c
        }))[0];
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating expense:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  async deleteExpense(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord("expense_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete expense ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return response.results.filter(result => result.success).length === 1;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting expense:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  async getAllIncome() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "crop_name_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "amount_c" } },
          { field: { Name: "quantity_c" } },
          { field: { Name: "unit_c" } },
          { field: { Name: "price_per_unit_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "buyer_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "field_name_c" } },
          { field: { Name: "field_id_c" } },
          { field: { Name: "crop_id_c" } }
        ],
        orderBy: [
          {
            fieldName: "date_c",
            sorttype: "DESC"
          }
        ]
      };

      const response = await this.apperClient.fetchRecords("income_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return (response.data || []).map(income => ({
        Id: income.Id,
        cropName: income.crop_id_c?.Name || income.crop_name_c || 'N/A',
        description: income.description_c,
        amount: income.amount_c,
        quantity: income.quantity_c,
        unit: income.unit_c,
        pricePerUnit: income.price_per_unit_c,
        date: income.date_c,
        buyer: income.buyer_c,
        notes: income.notes_c,
        fieldName: income.field_id_c?.Name || income.field_name_c || 'Unknown Field',
        fieldId: income.field_id_c?.Id || income.field_id_c,
        cropId: income.crop_id_c?.Id || income.crop_id_c
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching income:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  }

  async getIncomeById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "crop_name_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "amount_c" } },
          { field: { Name: "quantity_c" } },
          { field: { Name: "unit_c" } },
          { field: { Name: "price_per_unit_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "buyer_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "field_name_c" } },
          { field: { Name: "field_id_c" } },
          { field: { Name: "crop_id_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById("income_c", id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      const income = response.data;
      return {
        Id: income.Id,
        cropName: income.crop_id_c?.Name || income.crop_name_c || 'N/A',
        description: income.description_c,
        amount: income.amount_c,
        quantity: income.quantity_c,
        unit: income.unit_c,
        pricePerUnit: income.price_per_unit_c,
        date: income.date_c,
        buyer: income.buyer_c,
        notes: income.notes_c,
        fieldName: income.field_id_c?.Name || income.field_name_c || 'Unknown Field',
        fieldId: income.field_id_c?.Id || income.field_id_c,
        cropId: income.crop_id_c?.Id || income.crop_id_c
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching income with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  }

  async createIncome(incomeData) {
    try {
      const params = {
        records: [
          {
            Name: incomeData.description || "Income Record",
            crop_name_c: incomeData.cropName,
            description_c: incomeData.description,
            amount_c: parseFloat(incomeData.amount),
            quantity_c: parseFloat(incomeData.quantity),
            unit_c: incomeData.unit,
            price_per_unit_c: parseFloat(incomeData.pricePerUnit),
            date_c: incomeData.date,
            buyer_c: incomeData.buyer,
            notes_c: incomeData.notes,
            field_name_c: incomeData.fieldName,
            field_id_c: incomeData.fieldId ? parseInt(incomeData.fieldId) : null,
            crop_id_c: incomeData.cropId ? parseInt(incomeData.cropId) : null
          }
        ]
      };

      const response = await this.apperClient.createRecord("income_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create income ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
          cropName: result.data.crop_name_c,
          description: result.data.description_c,
          amount: result.data.amount_c,
          quantity: result.data.quantity_c,
          unit: result.data.unit_c,
          pricePerUnit: result.data.price_per_unit_c,
          date: result.data.date_c,
          buyer: result.data.buyer_c,
          notes: result.data.notes_c,
          fieldName: result.data.field_name_c,
          fieldId: result.data.field_id_c,
          cropId: result.data.crop_id_c
        }))[0];
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating income:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  async updateIncome(id, incomeData) {
    try {
      const params = {
        records: [
          {
            Id: parseInt(id),
            Name: incomeData.description || "Income Record",
            crop_name_c: incomeData.cropName,
            description_c: incomeData.description,
            amount_c: parseFloat(incomeData.amount),
            quantity_c: parseFloat(incomeData.quantity),
            unit_c: incomeData.unit,
            price_per_unit_c: parseFloat(incomeData.pricePerUnit),
            date_c: incomeData.date,
            buyer_c: incomeData.buyer,
            notes_c: incomeData.notes,
            field_name_c: incomeData.fieldName,
            field_id_c: incomeData.fieldId ? parseInt(incomeData.fieldId) : null,
            crop_id_c: incomeData.cropId ? parseInt(incomeData.cropId) : null
          }
        ]
      };

      const response = await this.apperClient.updateRecord("income_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update income ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
          cropName: result.data.crop_name_c,
          description: result.data.description_c,
          amount: result.data.amount_c,
          quantity: result.data.quantity_c,
          unit: result.data.unit_c,
          pricePerUnit: result.data.price_per_unit_c,
          date: result.data.date_c,
          buyer: result.data.buyer_c,
          notes: result.data.notes_c,
          fieldName: result.data.field_name_c,
          fieldId: result.data.field_id_c,
          cropId: result.data.crop_id_c
        }))[0];
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating income:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  async deleteIncome(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord("income_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete income ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return response.results.filter(result => result.success).length === 1;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting income:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  async getStats() {
    try {
      // Get all expenses and income to calculate statistics
      const [expenses, income] = await Promise.all([
        this.getAllExpenses(),
        this.getAllIncome()
      ]);

      const totalExpenses = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
      const totalIncome = income.reduce((sum, inc) => sum + (inc.amount || 0), 0);
      const netProfit = totalIncome - totalExpenses;

      const currentMonth = new Date();
      currentMonth.setDate(1);
      currentMonth.setHours(0, 0, 0, 0);

      const monthlyExpenses = expenses
        .filter(expense => new Date(expense.date) >= currentMonth)
        .reduce((sum, expense) => sum + (expense.amount || 0), 0);

      const monthlyIncome = income
        .filter(inc => new Date(inc.date) >= currentMonth)
        .reduce((sum, inc) => sum + (inc.amount || 0), 0);

      const expensesByCategory = {};
      expenses.forEach(expense => {
        expensesByCategory[expense.category] = (expensesByCategory[expense.category] || 0) + (expense.amount || 0);
      });

      return {
        totalExpenses: Math.round(totalExpenses * 100) / 100,
        totalIncome: Math.round(totalIncome * 100) / 100,
        netProfit: Math.round(netProfit * 100) / 100,
        monthlyExpenses: Math.round(monthlyExpenses * 100) / 100,
        monthlyIncome: Math.round(monthlyIncome * 100) / 100,
        expensesByCategory,
        profitMargin: totalIncome > 0 ? Math.round((netProfit / totalIncome) * 10000) / 100 : 0
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error calculating financial stats:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return {
        totalExpenses: 0,
        totalIncome: 0,
        netProfit: 0,
        monthlyExpenses: 0,
        monthlyIncome: 0,
        expensesByCategory: {},
        profitMargin: 0
      };
    }
  }

  async getStatsByField(fieldId) {
    try {
      // Get all expenses and income to filter by field
      const [expenses, income] = await Promise.all([
        this.getAllExpenses(),
        this.getAllIncome()
      ]);

      const fieldExpenses = expenses.filter(expense => expense.fieldId === parseInt(fieldId));
      const fieldIncome = income.filter(inc => inc.fieldId === parseInt(fieldId));

      const totalExpenses = fieldExpenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
      const totalIncome = fieldIncome.reduce((sum, inc) => sum + (inc.amount || 0), 0);
      const netProfit = totalIncome - totalExpenses;

      return {
        fieldId: parseInt(fieldId),
        totalExpenses: Math.round(totalExpenses * 100) / 100,
        totalIncome: Math.round(totalIncome * 100) / 100,
        netProfit: Math.round(netProfit * 100) / 100,
        expenseCount: fieldExpenses.length,
        incomeCount: fieldIncome.length
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error calculating field stats:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return {
        fieldId: parseInt(fieldId),
        totalExpenses: 0,
        totalIncome: 0,
        netProfit: 0,
        expenseCount: 0,
        incomeCount: 0
      };
    }
  }

  async getStatsByCrop(cropId) {
    try {
      // Get all expenses and income to filter by crop
      const [expenses, income] = await Promise.all([
        this.getAllExpenses(),
        this.getAllIncome()
      ]);

      const cropExpenses = expenses.filter(expense => expense.cropId === parseInt(cropId));
      const cropIncome = income.filter(inc => inc.cropId === parseInt(cropId));

      const totalExpenses = cropExpenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
      const totalIncome = cropIncome.reduce((sum, inc) => sum + (inc.amount || 0), 0);
      const netProfit = totalIncome - totalExpenses;

      return {
        cropId: parseInt(cropId),
        totalExpenses: Math.round(totalExpenses * 100) / 100,
        totalIncome: Math.round(totalIncome * 100) / 100,
        netProfit: Math.round(netProfit * 100) / 100,
        expenseCount: cropExpenses.length,
        incomeCount: cropIncome.length
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error calculating crop stats:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return {
        cropId: parseInt(cropId),
        totalExpenses: 0,
        totalIncome: 0,
        netProfit: 0,
        expenseCount: 0,
        incomeCount: 0
      };
    }
  }

  getExpenseCategories() {
    return [
      "Seeds",
      "Fertilizer",
      "Equipment",
      "Labor",
      "Fuel",
      "Maintenance",
      "Pesticides",
      "Utilities",
      "Insurance",
      "Other"
    ];
  }

  getUnits() {
    return [
      { value: "kg", label: "Kilograms (kg)" },
      { value: "lbs", label: "Pounds (lbs)" },
      { value: "tons", label: "Tons" },
      { value: "liters", label: "Liters" },
      { value: "gallons", label: "Gallons" },
      { value: "hours", label: "Hours" },
      { value: "units", label: "Units" }
    ];
  }
}

const financialService = new FinancialService();
export default financialService;