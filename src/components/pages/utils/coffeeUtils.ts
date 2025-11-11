import type { Coffee } from "../data/coffeeData";

export const filterCoffees = (
  coffees: Coffee[],
  searchTerm: string,
  selectedOrigin: string,
  selectedRoast: string,
  selectedPrice: string,
  selectedCertification: string
) => {
  return coffees.filter((coffee) => {
    const matchesSearch =
      coffee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coffee.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coffee.tastingNotes?.some((note) =>
        note.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesOrigin =
      selectedOrigin === "All" || coffee.origin === selectedOrigin;
    const matchesRoast =
      selectedRoast === "All" || coffee.roastLevel === selectedRoast;

    const matchesPrice =
      selectedPrice === "All" ||
      (selectedPrice === "Under $20" && coffee.price < 20) ||
      (selectedPrice === "$20-$30" &&
        coffee.price >= 20 &&
        coffee.price <= 30) ||
      (selectedPrice === "$30-$50" &&
        coffee.price > 30 &&
        coffee.price <= 50) ||
      (selectedPrice === "Over $50" && coffee.price > 50);

    const matchesCertification =
      selectedCertification === "All" ||
      (selectedCertification === "Organic" && coffee.isOrganic) ||
      (selectedCertification === "Fair Trade" && coffee.isFairTrade) ||
      (selectedCertification === "Single Origin" && coffee.isSingleOrigin);

    return (
      matchesSearch &&
      matchesOrigin &&
      matchesRoast &&
      matchesPrice &&
      matchesCertification
    );
  });
};

export const sortCoffees = (coffees: Coffee[], sortBy: string) => {
  const sorted = [...coffees];
  switch (sortBy) {
    case "featured":
      return sorted.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        if (a.bestSeller && !b.bestSeller) return -1;
        if (!a.bestSeller && b.bestSeller) return 1;
        return b.rating - a.rating;
      });
    case "price-low":
      return sorted.sort(
        (a, b) => (a.salePrice || a.price) - (b.salePrice || b.price)
      );
    case "price-high":
      return sorted.sort(
        (a, b) => (b.salePrice || b.price) - (a.salePrice || a.price)
      );
    case "rating":
      return sorted.sort((a, b) => b.rating - a.rating);
    case "name":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "origin":
      return sorted.sort((a, b) => a.origin.localeCompare(b.origin));
    default:
      return sorted;
  }
};

export const calculateAverageRating = (coffees: Coffee[]) => {
  if (coffees.length === 0) return 0;
  const total = coffees.reduce((sum, coffee) => sum + coffee.rating, 0);
  return Math.round((total / coffees.length) * 10) / 10;
};

export const getInStockCount = (coffees: Coffee[]) => {
  return coffees.filter((c) => c.inStock).length;
};

export const getOrganicCount = (coffees: Coffee[]) => {
  return coffees.filter((c) => c.isOrganic).length;
};

export const getUniqueOrigins = (coffees: Coffee[]) => {
  return Array.from(new Set(coffees.map((c) => c.origin)));
};
