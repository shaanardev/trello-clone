import { useState, useEffect } from "react";
import { unsplash } from "@/lib/unsplash";
import { defaultImages } from "@/constants/images";

export const useFetchUnsplashImages = () => {
    const [images, setImages] = useState<Array<Record<string, any>>>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
      const fetchImages = async () => {
        try {
            const result = await unsplash.photos.getRandom({
                collectionIds: ["317099"],
                count: 9
            });
  
            if (result && result.response) {
                const newImages = (result.response as Array<Record<string, any>>);
                setImages(newImages);
            } else {
                console.error("Failed to get images from unsplash")
            }
        } catch (error) {
            console.error(error);
            setImages(defaultImages);
        } finally {
            setIsLoading(false);
        }
      }

      fetchImages();
    }, [])

    return { images, isLoading };
}