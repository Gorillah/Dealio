"use client";

import { scrapeAndStoreProduct } from "@/lib/actions";
import { useState } from "react";

const isValidAmazonProductsUrl = (url: string) => {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname;

    // Check if the hostname is amazon.com or amazon.
    if (
      hostname.includes("amazon.com") ||
      hostname.includes("amazon.") ||
      hostname.endsWith("amazon")
    ) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

export default function Searchbar() {
  const [searchPrompt, setSearchPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isValidLink = isValidAmazonProductsUrl(searchPrompt);

    if (!isValidLink) {
      return alert("Please enter a valid Amazon link");
    }
    try {
      setIsLoading(true);
      // Scrape the product page
      const product = await scrapeAndStoreProduct(searchPrompt);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 mt-12">
      <input
        type="text"
        value={searchPrompt}
        onChange={(e) => setSearchPrompt(e.target.value)}
        className="searchbar-input "
        placeholder="Search"
      />
      <button type="submit" className="searchbar-btn" disabled={isLoading}>
        {isLoading ? "Loading..." : "Search"}
      </button>
    </form>
  );
}
