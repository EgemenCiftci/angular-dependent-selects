import { Injectable } from '@angular/core';
import { FruitType } from './fruit-type';
import { Fruit } from './fruit';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private readonly API_DELAY_MS = 500;
  private readonly fruitTypes: FruitType[] = [
    { id: 1, name: 'Sweet' },
    { id: 2, name: 'Sour' },
    { id: 3, name: 'Salty' },
    { id: 4, name: 'Bitter' }
  ];

  private readonly allFruits: Fruit[] = [
    { id: 1, name: 'Apple', typeId: 1 },
    { id: 2, name: 'Banana', typeId: 1 },
    { id: 3, name: 'Lemon', typeId: 2 },
    { id: 4, name: 'Grapefruit', typeId: 2 },
    { id: 5, name: 'Olive', typeId: 3 },
    { id: 6, name: 'Celery', typeId: 4 },
    { id: 7, name: 'Kale', typeId: 4 },
    { id: 8, name: 'Cucumber', typeId: 3 },
    { id: 9, name: 'Mango', typeId: 1 }
  ];

  /**
   * Simulates an API call to get all fruit types
   * @returns Promise resolving to array of fruit types
   */
  async getFruitTypes(): Promise<FruitType[]> {
    await new Promise(resolve => setTimeout(resolve, this.API_DELAY_MS));
    return this.fruitTypes;
  }

  /**
   * Simulates an API call to get fruits by type
   * @param typeId - The ID of the fruit type to filter by
   * @returns Promise resolving to filtered fruits
   */
  async getFruitsByType(typeId: number): Promise<Fruit[]> {
    await new Promise(resolve => setTimeout(resolve, this.API_DELAY_MS));
    return this.allFruits.filter(fruit => fruit.typeId === typeId);
  }

  /**
   * Simulates an API call to submit selected items
   * @param fruitType - Selected fruit type
   * @param selectedFruits - Array of selected fruits
   * @returns Promise resolving to void
   */
  async saveItems(fruitType: FruitType | null, selectedFruits: Fruit[]): Promise<void> {
    await new Promise<void>(resolve => setTimeout(resolve, this.API_DELAY_MS));
    console.log('API Call - Save Items:');
    console.log('Selected Fruit Type:', fruitType);
    console.log('Selected Fruits:', selectedFruits);
  }
}
