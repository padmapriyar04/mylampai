import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, MapPinIcon, ClockIcon, DollarSignIcon, BriefcaseIcon, AwardIcon } from 'lucide-react'

interface TalentProfile {
  id: string
  resumeId: string
  interviewId: string
  skills: string[]
  profiles: string[]
  certifications: string[]
  expectedSalary: string
  locationPref: string
  experienceYears: string
  availability: string
}

interface TalentProfileCardProps {
  profile: TalentProfile
}

const ProfileDetail = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-center space-x-2 text-sm">
    {icon}
    <span className="font-medium">{label}:</span>
    <span>{value}</span>
  </div>
)

const TagList = ({ title, items }: { title: string; items: string[] }) => (
  <div className="mt-4">
    <h3 className="font-semibold mb-2">{title}</h3>
    <div className="flex flex-wrap gap-2">
      {items.map((item, index) => (
        <Badge key={index} variant="secondary">{item}</Badge>
      ))}
    </div>
  </div>
)

export function TalentProfileCard({ profile }: TalentProfileCardProps) {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>User Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 ">
        <ProfileDetail
          icon={<BriefcaseIcon className="h-4 w-4" />}
          label="Experience"
          value={`${profile.experienceYears} ${parseInt(profile.experienceYears) === 1 ? 'year' : 'years'}`}
        />
        <ProfileDetail
          icon={<MapPinIcon className="h-4 w-4" />}
          label="Location Preference"
          value={profile.locationPref}
        />
        <ProfileDetail
          icon={<ClockIcon className="h-4 w-4" />}
          label="Availability"
          value={profile.availability}
        />
        <ProfileDetail
          icon={<DollarSignIcon className="h-4 w-4" />}
          label="Expected Salary"
          value={profile.expectedSalary}
        />

        <TagList title="Skills" items={profile.skills} />
        <TagList title="Profiles" items={profile.profiles} />

        {profile.certifications.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2 flex items-center">
              <AwardIcon className="h-4 w-4 mr-2" />
              Certifications
            </h3>
            <ul className="list-disc list-inside">
              {profile.certifications.map((cert, index) => (
                <li key={index}>{cert}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-4 text-sm text-muted-foreground">
          <p>Resume ID: {profile.resumeId}</p>
          <p>Interview ID: {profile.interviewId}</p>
        </div>
      </CardContent>
    </Card>
  )
}

