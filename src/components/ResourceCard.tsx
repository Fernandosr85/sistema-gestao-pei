import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Download, Eye, Star } from 'lucide-react';
import { Resource } from '@/types/resource';
import { cn } from '@/lib/utils';

interface ResourceCardProps {
  resource: Resource;
  onView: (resource: Resource) => void;
  onDownload: (resource: Resource) => void;
  onFavorite: (resource: Resource) => void;
}

const resourceTypeColors: Record<string, string> = {
  'video': 'bg-red-500',
  'material-impresso': 'bg-blue-500',
  'jogo': 'bg-purple-500',
  'aplicativo': 'bg-green-500',
  'prancha-caa': 'bg-orange-500',
  'sequencia-didatica': 'bg-indigo-500',
  'avaliacao-adaptada': 'bg-cyan-500',
  'roteiro-visual': 'bg-pink-500',
  'historia-social': 'bg-teal-500',
  'outro': 'bg-gray-500'
};

const resourceTypeLabels: Record<string, string> = {
  'video': '🎥 Vídeo',
  'material-impresso': '📄 Material Impresso',
  'jogo': '🎮 Jogo',
  'aplicativo': '📱 Aplicativo',
  'prancha-caa': '🗣️ Prancha CAA',
  'sequencia-didatica': '📚 Sequência Didática',
  'avaliacao-adaptada': '📝 Avaliação Adaptada',
  'roteiro-visual': '👁️ Roteiro Visual',
  'historia-social': '📖 História Social',
  'outro': '📦 Outro'
};

export function ResourceCard({ resource, onView, onDownload, onFavorite }: ResourceCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      <div className="relative">
        <img
          src={resource.thumbnailUrl}
          alt={resource.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 left-2">
          <Badge className={cn('text-white', resourceTypeColors[resource.type])}>
            {resourceTypeLabels[resource.type]}
          </Badge>
        </div>
        {resource.isNew && (
          <div className="absolute top-2 right-2">
            <Badge variant="default">Novo</Badge>
          </div>
        )}
        {resource.isFeatured && resource.rating > 4.5 && resource.downloadCount > 100 && (
          <div className="absolute top-10 right-2">
            <Badge className="bg-yellow-500 text-white">⭐ Destaque</Badge>
          </div>
        )}
      </div>

      <CardHeader className="flex-1">
        <h3 className="font-semibold text-lg line-clamp-2 mb-2">{resource.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-3">{resource.description}</p>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-1">
          {resource.tags.slice(0, 3).map((tag, idx) => (
            <Badge key={idx} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {resource.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{resource.tags.length - 3}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-1 text-sm">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={cn(
                'h-4 w-4',
                i < Math.floor(resource.rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              )}
            />
          ))}
          <span className="ml-1 font-semibold">{resource.rating.toFixed(1)}</span>
          <span className="text-muted-foreground">({resource.reviewCount})</span>
        </div>

        <div className="text-sm text-muted-foreground space-y-1">
          <div className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            <span>{resource.downloadCount} downloads</span>
          </div>
          <div>👤 Por: {resource.author.name}</div>
          <div>📅 {new Date(resource.createdAt).toLocaleDateString('pt-BR')}</div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onFavorite(resource)}
          className="flex-1"
        >
          <Heart className="h-4 w-4 mr-1" />
          Favoritar
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDownload(resource)}
          className="flex-1"
        >
          <Download className="h-4 w-4 mr-1" />
          Baixar
        </Button>
        <Button
          size="sm"
          onClick={() => onView(resource)}
          className="flex-1"
        >
          <Eye className="h-4 w-4 mr-1" />
          Ver
        </Button>
      </CardFooter>
    </Card>
  );
}
