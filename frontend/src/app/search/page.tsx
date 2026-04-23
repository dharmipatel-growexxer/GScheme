"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Search as SearchIcon, Loader2, Mic } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SchemeCard } from "@/components/ui/scheme-card"
import { Modal } from "@/components/ui/modal"
import { ChatPanel } from "@/components/chat/ChatPanel"
import { searchSchemes, type Scheme } from "@/lib/api"
import { motion } from "framer-motion"

function SearchContent() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""
  
  const [query, setQuery] = useState(initialQuery)
  const [schemes, setSchemes] = useState<Scheme[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null)

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery)
    }
  }, [initialQuery])

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return
    setIsLoading(true)
    setHasSearched(true)
    try {
      const results = await searchSchemes(searchQuery)
      setSchemes(results)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    performSearch(query)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl flex-1 flex flex-col">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Search Schemes</h1>
        <form onSubmit={handleSearch} className="relative flex items-center w-full">
            <div className="absolute left-4 text-muted-foreground">
              <Mic className="h-5 w-5 hover:text-primary cursor-pointer transition-colors" />
            </div>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by scheme name or keywords..."
            className="h-14 pl-12 pr-14 text-lg rounded-full shadow-sm border-muted focus-visible:ring-primary/50"
          />
          <Button 
            type="submit" 
            size="icon"
            className="absolute right-2 h-10 w-10 rounded-full bg-primary hover:bg-primary/90"
          >
            <SearchIcon className="h-5 w-5" />
          </Button>
        </form>
      </div>

      <div className="flex-1">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
            <p>Searching knowledge base...</p>
          </div>
        ) : hasSearched ? (
          <div className="space-y-6">
            <div className="text-sm text-muted-foreground">
              Found {schemes.length} result{schemes.length === 1 ? "" : "s"} for "{query}"
            </div>
            
            {schemes.length > 0 ? (
              <motion.div 
                className="grid gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {schemes.map((scheme, i) => (
                  <motion.div
                    key={`${scheme.id}-${i}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <SchemeCard 
                      scheme={scheme} 
                      onClick={() => setSelectedScheme(scheme)} 
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-20 border rounded-xl bg-card border-dashed">
                <p className="text-lg font-medium">No exact matches found</p>
                <p className="text-muted-foreground">Try adjusting your search terms or use the Eligibility Check to find schemes for you.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            Enter a query above to start searching.
          </div>
        )}
      </div>

      <Modal 
        isOpen={!!selectedScheme} 
        onClose={() => setSelectedScheme(null)}
        className="h-[85vh] max-h-[800px]"
      >
        {selectedScheme && <ChatPanel scheme={selectedScheme} />}
      </Modal>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center"><Loader2 className="animate-spin inline mr-2"/> Loading...</div>}>
      <SearchContent />
    </Suspense>
  )
}
