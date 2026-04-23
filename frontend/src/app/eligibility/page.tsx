"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, ChevronLeft, Loader2, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SchemeCard } from "@/components/ui/scheme-card"
import { Modal } from "@/components/ui/modal"
import { ChatPanel } from "@/components/chat/ChatPanel"
import { GeneralChatPanel } from "@/components/chat/GeneralChatPanel"
import { discoverSchemes, type Scheme } from "@/lib/api"
import { cn } from "@/lib/utils"

const STEPS = [
  { id: "gender", title: "Gender", type: "radio", options: ["Male", "Female", "Transgender"] },
  { id: "age", title: "Age", type: "number", placeholder: "e.g., 25" },
  { id: "state", title: "State", type: "select", options: [
    "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
    "Chandigarh", "Chhattisgarh", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh",
    "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep",
    "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha",
    "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal"
  ] },
  { id: "area", title: "Area", type: "radio", options: ["Urban", "Rural"] },
  { id: "caste", title: "Caste Category", type: "select", options: ["General", "OBC", "SC", "ST", "EWS", "Minority"] },
  { id: "disability", title: "Disability", type: "radio", options: ["No", "Yes"] },
  { id: "profession", title: "Profession", type: "select", options: ["Student", "Farmer", "Entrepreneur / Self-Employed", "Corporate Employee", "Government Employee", "Unemployed", "Other"] },
]

export default function EligibilityPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [profile, setProfile] = useState<Record<string, string>>({})
  
  const [isDiscovering, setIsDiscovering] = useState(false)
  const [discoveryResult, setDiscoveryResult] = useState<{summary: string, schemes: Scheme[]} | null>(null)
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null)

  const step = STEPS[currentStep]
  const value = profile[step.id] || ""
  const canProceed = value.toString().trim().length > 0

  const handleNext = async () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      setIsDiscovering(true)
      try {
        const result = await discoverSchemes(profile)
        setDiscoveryResult(result)
      } catch (err) {
        console.error(err)
      } finally {
        setIsDiscovering(false)
      }
    }
  }

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1)
  }

  // Render Form Step
  if (!isDiscovering && !discoveryResult) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <div className="mb-8">
            <div className="flex justify-between text-sm font-medium text-muted-foreground mb-2">
              <span>Step {currentStep + 1} of {STEPS.length}</span>
              <span>{Math.round(((currentStep + 1) / STEPS.length) * 100)}%</span>
            </div>
            <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
              <div 
                className="bg-primary h-full transition-all duration-300"
                style={{ width: (((currentStep + 1) / STEPS.length) * 100) + '%' }}
              />
            </div>
          </div>

          <CardWrapper>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="min-h-[200px] flex flex-col justify-center"
              >
                <h2 className="text-2xl font-bold mb-6 text-center">What is your {step.title.toLowerCase()}?</h2>
                
                {step.type === "radio" && (
                  <div className="grid gap-3">
                    {step.options?.map(opt => (
                      <button
                        key={opt}
                        onClick={() => setProfile({...profile, [step.id]: opt})}
                        className={cn(
                          "w-full p-4 rounded-xl border-2 text-left transition-all",
                          value === opt 
                            ? "border-primary bg-primary/5 font-medium" 
                            : "border-muted hover:border-primary/50 hover:bg-accent"
                        )}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}

                {step.type === "select" && (
                  <div className="grid gap-3">
                    <select 
                      className="w-full p-4 rounded-xl border-2 border-muted bg-background focus:border-primary focus:ring-0 outline-none appearance-none"
                      value={value}
                      onChange={(e) => setProfile({...profile, [step.id]: e.target.value})}
                    >
                      <option value="" disabled>Select {step.title}...</option>
                      {step.options?.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                )}

                {step.type === "number" && (
                  <div>
                    <Input 
                      type="number" 
                      placeholder={step.placeholder}
                      className="h-14 text-lg rounded-xl border-2 border-muted focus-visible:ring-0 focus-visible:border-primary text-center"
                      value={value}
                      onChange={(e) => setProfile({...profile, [step.id]: e.target.value})}
                      autoFocus
                    />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button 
                variant="ghost" 
                onClick={handleBack} 
                disabled={currentStep === 0}
                className="text-muted-foreground"
              >
                <ChevronLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button 
                onClick={handleNext} 
                disabled={!canProceed}
                className="px-8 rounded-full"
              >
                {currentStep === STEPS.length - 1 ? "Discover Schemes" : "Next"}
                {currentStep !== STEPS.length - 1 && <ChevronRight className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </CardWrapper>
        </div>
      </div>
    )
  }

  // Render Loading State
  if (isDiscovering) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-6" />
        <h2 className="text-2xl font-bold">Analyzing your profile...</h2>
        <p className="text-muted-foreground mt-2 text-center max-w-md">
          Our AI is searching through hundreds of government databases to find the perfect schemes for you.
        </p>
      </div>
    )
  }

  // Render Results State
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl flex-1">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Your Recommended Schemes</h1>
          <p className="text-muted-foreground">Based on your profile, we found these matches.</p>
        </div>
        <Button variant="outline" onClick={() => {
          setDiscoveryResult(null)
          setCurrentStep(0)
          setProfile({})
        }}>
          Start Over
        </Button>
      </div>



      <div className="grid gap-4">
        {discoveryResult?.schemes.map((scheme, i) => (
          <motion.div
            key={`${scheme.id}-${i}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <SchemeCard scheme={scheme} onClick={() => setSelectedScheme(scheme)} />
          </motion.div>
        ))}
      </div>

      <GeneralChatPanel schemes={discoveryResult?.schemes || []} profile={profile} />

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

function CardWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-card rounded-2xl shadow-xl border p-6 md:p-8">
      {children}
    </div>
  )
}
