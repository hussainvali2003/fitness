"use client";

import React, { useState, useEffect } from "react";
import {
  getStoredNutritionEntries,
  saveNutritionEntry,
  deleteNutritionEntry,
  getStoredFoodLibrary,
  saveCustomFood,
  getStoredWaterLogs,
  addWaterAmount,
  resetTodayWater,
  getStoredProfile,
} from "@/lib/storage";
import { NutritionEntry, FoodItem } from "@/types";
import {
  UtensilsCrossed,
  Plus,
  Trash2,
  Droplets,
  Flame,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Search,
} from "lucide-react";

export default function NutritionPage() {
  const [entries, setEntries] = useState<NutritionEntry[]>([]);
  const [foodLibrary, setFoodLibrary] = useState<FoodItem[]>([]);
  const [waterLogs, setWaterLogs] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);

  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedMeal, setSelectedMeal] = useState<"breakfast" | "lunch" | "snack" | "dinner">("breakfast");
  const [searchTerm, setSearchTerm] = useState("");

  // Custom food modal
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customCalories, setCustomCalories] = useState("");
  const [customProtein, setCustomProtein] = useState("");
  const [customCarbs, setCustomCarbs] = useState("");
  const [customFat, setCustomFat] = useState("");

  const loadData = () => {
    setEntries(getStoredNutritionEntries());
    setFoodLibrary(getStoredFoodLibrary());
    setWaterLogs(getStoredWaterLogs());
    setProfile(getStoredProfile());
  };

  useEffect(() => {
    loadData();
  }, []);

  const todayEntries = entries.filter((e) => e.date === date);
  const totalCalories = todayEntries.reduce((sum, e) => sum + e.calories, 0);
  const totalProtein = Math.round(todayEntries.reduce((sum, e) => sum + e.proteinG, 0));
  const totalCarbs = Math.round(todayEntries.reduce((sum, e) => sum + e.carbsG, 0));
  const totalFat = Math.round(todayEntries.reduce((sum, e) => sum + e.fatG, 0));

  const targetCalories = profile?.calorieTarget || 1850;
  const targetProtein = profile?.proteinTargetMax || 135;
  const remainingCalories = targetCalories - totalCalories;
  const remainingProtein = targetProtein - totalProtein;

  // Water calculations
  const todayWaterMl = waterLogs.filter((w) => w.date === date).reduce((sum, w) => sum + w.amountMl, 0);
  const targetWaterMl = (profile?.waterTargetLiters || 3.0) * 1000;
  const waterPct = Math.min(100, Math.round((todayWaterMl / targetWaterMl) * 100));

  const handleAddFromLibrary = (food: FoodItem) => {
    const newEntry: NutritionEntry = {
      id: "n_" + Date.now(),
      date,
      foodName: food.name,
      quantity: 1,
      servingUnit: food.servingSize,
      calories: food.calories,
      proteinG: food.proteinG,
      carbsG: food.carbsG,
      fatG: food.fatG,
      mealType: selectedMeal,
    };
    saveNutritionEntry(newEntry);
    loadData();
  };

  const handleSaveCustomFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName || !customCalories) return;

    const newFood: FoodItem = {
      id: "cf_" + Date.now(),
      name: customName,
      servingSize: "1 serving",
      calories: parseFloat(customCalories) || 0,
      proteinG: parseFloat(customProtein) || 0,
      carbsG: parseFloat(customCarbs) || 0,
      fatG: parseFloat(customFat) || 0,
      category: "Meal",
    };

    saveCustomFood(newFood);
    handleAddFromLibrary(newFood);

    setCustomName("");
    setCustomCalories("");
    setCustomProtein("");
    setCustomCarbs("");
    setCustomFat("");
    setShowCustomModal(false);
    loadData();
  };

  const handleDeleteEntry = (id: string) => {
    deleteNutritionEntry(id);
    loadData();
  };

  const meals: { id: "breakfast" | "lunch" | "snack" | "dinner"; label: string }[] = [
    { id: "breakfast", label: "Breakfast" },
    { id: "lunch", label: "Lunch" },
    { id: "snack", label: "Snack & Pre-Workout" },
    { id: "dinner", label: "Dinner" },
  ];

  const filteredFoods = foodLibrary.filter((f) =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in pb-16 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider bg-brand-amber/15 text-brand-amber border border-brand-amber/30">
              Dietary Intake
            </span>
            <span className="text-xs text-surface-400 font-semibold font-mono">1,850 kcal &middot; 135g Protein</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase mt-1">
            Nutrition &amp; Macro Tracker
          </h1>
          <p className="text-xs text-surface-400">
            Fuel fat loss and lean muscle retention with precision macro logs.
          </p>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-2 bg-[#111114] px-3 py-1.5 rounded-2xl border border-[#26262b]">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-transparent text-xs text-white font-mono focus:outline-none"
          />
        </div>
      </div>

      {/* Top Overview Cards: Macros & Water */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Calories Card */}
        <div className="p-5 rounded-3xl bg-[#111114] border border-[#26262b] space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Calories</span>
            <Flame className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-2xl font-black text-white font-mono">{totalCalories} <span className="text-xs text-neutral-400 font-sans">/ {targetCalories} kcal</span></p>
          <div className="w-full bg-[#08080a] rounded-full h-2 overflow-hidden border border-[#26262b]">
            <div
              className="bg-rose-400 h-full rounded-full transition-all"
              style={{ width: `${Math.min(100, (totalCalories / targetCalories) * 100)}%` }}
            />
          </div>
          <p className="text-[11px] text-neutral-400 font-medium">
            {remainingCalories >= 0 ? `${remainingCalories} kcal remaining` : `${Math.abs(remainingCalories)} kcal over target`}
          </p>
        </div>

        {/* Protein Card */}
        <div className="p-5 rounded-3xl bg-[#111114] border border-[#26262b] space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Protein (Crucial)</span>
            <UtensilsCrossed className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-amber-400 font-mono">{totalProtein} <span className="text-xs text-neutral-400 font-sans">/ {targetProtein} g</span></p>
          <div className="w-full bg-[#08080a] rounded-full h-2 overflow-hidden border border-[#26262b]">
            <div
              className="bg-amber-400 h-full rounded-full transition-all"
              style={{ width: `${Math.min(100, (totalProtein / targetProtein) * 100)}%` }}
            />
          </div>
          <p className="text-[11px] text-neutral-400 font-medium">
            {remainingProtein > 0 ? `${remainingProtein}g to daily goal` : `Goal unlocked! (+${Math.abs(remainingProtein)}g)`}
          </p>
        </div>

        {/* Carbs & Fat Card */}
        <div className="p-5 rounded-3xl bg-[#111114] border border-[#26262b] space-y-3">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Carbs &amp; Fats</span>
            <Sparkles className="w-4 h-4 text-[#ee4d00]" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[10px] text-neutral-400 font-bold uppercase">Carbs</span>
              <p className="text-lg font-black text-[#ee4d00] font-mono">{totalCarbs}g</p>
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 font-bold uppercase">Fat</span>
              <p className="text-lg font-black text-indigo-400 font-mono">{totalFat}g</p>
            </div>
          </div>
          <p className="text-[10px] text-neutral-500 font-mono">Balanced split for energy</p>
        </div>

        {/* Water Ring Card */}
        <div className="p-5 rounded-3xl bg-[#111114] border border-[#26262b] space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Hydration</span>
            <Droplets className="w-4 h-4 text-[#ee4d00]" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-black text-[#ee4d00] font-mono">
                {(todayWaterMl / 1000).toFixed(1)} <span className="text-xs text-neutral-400 font-sans">/ 3.0 L</span>
              </p>
              <p className="text-[10px] text-surface-400">{waterPct}% hydration</p>
            </div>
            <button
              type="button"
              onClick={() => resetTodayWater(date)}
              title="Reset Water"
              className="p-1.5 text-surface-500 hover:text-white rounded-lg hover:bg-surface-800 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex items-center gap-1 pt-1">
            <button
              type="button"
              onClick={() => {
                addWaterAmount(250, date);
                loadData();
              }}
              className="flex-1 py-1 rounded-lg bg-surface-900 hover:bg-surface-800 text-[10px] font-bold text-[#ee4d00] border border-surface-700 transition-colors"
            >
              +250ml
            </button>
            <button
              type="button"
              onClick={() => {
                addWaterAmount(500, date);
                loadData();
              }}
              className="flex-1 py-1 rounded-lg bg-surface-900 hover:bg-surface-800 text-[10px] font-bold text-[#ee4d00] border border-surface-700 transition-colors"
            >
              +500ml
            </button>
            <button
              type="button"
              onClick={() => {
                addWaterAmount(1000, date);
                loadData();
              }}
              className="flex-1 py-1 rounded-lg bg-surface-900 hover:bg-surface-800 text-[10px] font-bold text-[#ee4d00] border border-surface-700 transition-colors"
            >
              +1L
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Meals by Category & Quick-Add Library */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Logged Meals by Bucket */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-3xl bg-[#111114] border border-[#26262b] space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-[#26262b]">
              <h3 className="text-xs font-black text-white uppercase tracking-wider">
                Logged Meals ({todayEntries.length})
              </h3>
              <span className="text-xs font-mono font-bold text-[#ee4d00]">
                {totalCalories} kcal Total
              </span>
            </div>

            {meals.map((m) => {
              const mealItems = todayEntries.filter((e) => e.mealType === m.id);
              const mealCal = mealItems.reduce((acc, curr) => acc + curr.calories, 0);
              const mealPro = Math.round(mealItems.reduce((acc, curr) => acc + curr.proteinG, 0));

              return (
                <div key={m.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">{m.label}</span>
                    <span className="text-[11px] font-mono text-neutral-400">
                      {mealCal} kcal &middot; <strong className="text-amber-400">{mealPro}g protein</strong>
                    </span>
                  </div>

                  {mealItems.length > 0 ? (
                    <div className="space-y-1.5">
                      {mealItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-3 rounded-2xl bg-[#08080a] border border-[#26262b] text-xs"
                        >
                          <div>
                            <p className="font-bold text-white">{item.foodName}</p>
                            <p className="text-[10px] text-neutral-400 font-mono">
                              {item.calories} kcal &middot; {item.proteinG}g P &middot; {item.carbsG}g C &middot; {item.fatG}g F
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteEntry(item.id)}
                            className="p-1.5 text-neutral-500 hover:text-rose-400 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3 rounded-2xl bg-[#08080a]/40 border border-[#26262b]/60 text-[11px] text-neutral-500 text-center">
                      No foods logged for {m.label.toLowerCase()} yet.
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Quick-Add Food Library & Custom Creator */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl bg-[#111114] border border-[#26262b] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                <UtensilsCrossed className="w-4 h-4 text-[#ee4d00]" />
                <span>Gym Food Library</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowCustomModal(true)}
                className="text-[11px] font-bold text-[#ee4d00] hover:underline"
              >
                + Custom Food
              </button>
            </div>

            {/* Target Meal Picker */}
            <div className="flex items-center gap-1 bg-[#08080a] p-1 rounded-xl border border-[#26262b]">
              {meals.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSelectedMeal(m.id)}
                  className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all capitalize ${
                    selectedMeal === m.id
                      ? "bg-[#ee4d00] text-[#08080a] shadow-[0_0_12px_rgba(56,189,248,0.3)] font-black"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  {m.id}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter foods..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-[#08080a] border border-[#26262b] rounded-xl text-xs text-white focus:outline-none focus:border-[#ee4d00]"
              />
            </div>

            {/* Food items list */}
            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {filteredFoods.map((food) => (
                <div
                  key={food.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-[#08080a] border border-[#26262b] hover:border-[#ee4d00]/40 transition-all"
                >
                  <div>
                    <p className="text-xs font-bold text-white">{food.name}</p>
                    <p className="text-[10px] text-neutral-400 font-mono">
                      {food.servingSize} &middot; {food.calories} kcal &middot;{" "}
                      <strong className="text-amber-400">{food.proteinG}g P</strong>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddFromLibrary(food)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#111114] hover:bg-[#ee4d00] hover:text-[#08080a] text-[#ee4d00] font-bold text-[10px] border border-[#26262b] transition-all"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Custom Food Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-[#111114] border border-[#26262b] rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-black text-white uppercase tracking-tight">
              Create Custom Food Item
            </h3>
            <form onSubmit={handleSaveCustomFood} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-neutral-400 uppercase">Food Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Soya Paneer Stir Fry"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full mt-1 bg-[#08080a] border border-[#26262b] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ee4d00]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-neutral-400 uppercase">Calories (kcal) *</label>
                  <input
                    type="number"
                    placeholder="e.g. 250"
                    value={customCalories}
                    onChange={(e) => setCustomCalories(e.target.value)}
                    className="w-full mt-1 bg-[#08080a] border border-[#26262b] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ee4d00]"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-amber-400 uppercase">Protein (g) *</label>
                  <input
                    type="number"
                    placeholder="e.g. 28"
                    value={customProtein}
                    onChange={(e) => setCustomProtein(e.target.value)}
                    className="w-full mt-1 bg-[#08080a] border border-[#26262b] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ee4d00]"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-neutral-400 uppercase">Carbs (g)</label>
                  <input
                    type="number"
                    placeholder="e.g. 15"
                    value={customCarbs}
                    onChange={(e) => setCustomCarbs(e.target.value)}
                    className="w-full mt-1 bg-[#08080a] border border-[#26262b] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ee4d00]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-neutral-400 uppercase">Fat (g)</label>
                  <input
                    type="number"
                    placeholder="e.g. 6"
                    value={customFat}
                    onChange={(e) => setCustomFat(e.target.value)}
                    className="w-full mt-1 bg-[#08080a] border border-[#26262b] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ee4d00]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="px-4 py-2 text-xs font-bold text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#ee4d00] text-[#08080a] font-extrabold text-xs shadow-[0_0_20px_rgba(56,189,248,0.25)] hover:brightness-110"
                >
                  Save &amp; Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
