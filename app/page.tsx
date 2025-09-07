// app/page.tsx (Server Component)
import { fetchSportsData } from "@/lib/api"
import HomeContent from "./clint"


export default async function HomePage() {
  try {
    const initialData = await fetchSportsData()
    const lastUpdated = new Date()

    return (
      <HomeContent
        initialData={initialData}
        initialLastUpdated={lastUpdated.toISOString()}
        initialError={null}
      />
    )
  } catch (error) {
    return (
      <HomeContent
        initialData={[]}
        initialLastUpdated={new Date().toISOString()}
        initialError="Failed to fetch initial data"
      />
    )
  }
}