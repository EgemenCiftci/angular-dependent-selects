import { Component, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';

interface FruitType {
  id: number;
  name: string;
}

interface Fruit {
  id: number;
  name: string;
  typeId: number;
}

@Component({
  selector: 'app-root',
  imports: [
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private initialized = false;

  fruitTypes = signal<FruitType[]>([
    { id: 1, name: 'Sweet' },
    { id: 2, name: 'Sour' },
    { id: 3, name: 'Salty' },
    { id: 4, name: 'Bitter' }
  ]);

  allFruits = signal<Fruit[]>([
    { id: 1, name: 'Apple', typeId: 1 },
    { id: 2, name: 'Banana', typeId: 1 },
    { id: 3, name: 'Lemon', typeId: 2 },
    { id: 4, name: 'Grapefruit', typeId: 2 },
    { id: 5, name: 'Olive', typeId: 3 },
    { id: 6, name: 'Celery', typeId: 4 },
    { id: 7, name: 'Kale', typeId: 4 },
    { id: 8, name: 'Cucumber', typeId: 3 },
    { id: 9, name: 'Mango', typeId: 1 }
  ]);

  fruits = signal<Fruit[]>([]);

  private getFruitsByType(typeId: number) {
    return this.allFruits().filter(fruit => fruit.typeId === typeId);
  }

  private apiCallSimulation(fruitType: FruitType | null, selectedFruits: Fruit[]) {
    console.log('API Call Simulation:');
    console.log('Selected Fruit Type:', fruitType);
    console.log('Selected Fruits:', selectedFruits);
    return new Promise<void>(resolve => setTimeout(resolve, 500));
  }

  formGroup = new FormGroup({
    fruitType: new FormControl<FruitType | null>(this.fruitTypes().find(ft => ft.id === 2) || null),
    fruit: new FormControl<Fruit[]>([])
  });

  private updateQueryParams() {
    const fruitType = this.formGroup.controls.fruitType.value;
    const selectedFruits = this.formGroup.controls.fruit.value;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        type: fruitType?.id,
        fruits: selectedFruits?.map(f => f.id).join(',')
      },
      queryParamsHandling: 'merge'
    });
  }

  ngOnInit() {
    // Subscribe to query params
    this.route.queryParams.subscribe(params => {
      let shouldCallApi = false;

      if (params['type']) {
        const typeId = Number(params['type']);
        const fruitType = this.fruitTypes().find(ft => ft.id === typeId);
        if (fruitType) {
          this.formGroup.controls.fruitType.setValue(fruitType, { emitEvent: false });
          this.fruits.set(this.getFruitsByType(fruitType.id));
          shouldCallApi = true;
        }
      }

      if (params['fruits']) {
        const fruitIds = new Set(params['fruits'].split(',').map(Number));
        const selectedFruits = this.fruits().filter(f => fruitIds.has(f.id));
        this.formGroup.controls.fruit.setValue(selectedFruits, { emitEvent: false });
      }

      // Make initial API call only if this is page load
      if (shouldCallApi && !this.initialized) {
        const fruitType = this.formGroup.controls.fruitType.value;
        const selectedFruits = this.formGroup.controls.fruit.value;
        if (fruitType) {
          this.apiCallSimulation(fruitType, selectedFruits || []);
        }
        this.initialized = true;
      }
    });
  }

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {
    // Subscribe to fruit type changes
    this.formGroup.controls.fruitType.valueChanges.subscribe(fruitType => {
      if (fruitType) {
        this.fruits.set(this.getFruitsByType(fruitType.id));
        this.formGroup.controls.fruit.setValue([], { emitEvent: false }); // Prevent fruit selection from triggering
        this.apiCallSimulation(fruitType, []); // Call API here with empty selection
        this.updateQueryParams(); // Update URL when fruit type changes
      }
    });

    // Subscribe to fruit selection changes
    this.formGroup.controls.fruit.valueChanges.subscribe(selectedFruits => {
      const fruitType = this.formGroup.controls.fruitType.value;
      if (this.initialized) { // Only call API after initialization and when user changes selection
        this.apiCallSimulation(fruitType, selectedFruits || []);
      }
      this.updateQueryParams();
    });
  }
}
