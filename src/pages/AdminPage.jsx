import { useEffect, useState } from 'react'
import {
  Activity,
  ArrowDownRight,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  ExternalLink,
  Eye,
  FilePlus2,
  Images,
  ImagePlus,
  LayoutDashboard,
  LoaderCircle,
  Menu,
  Newspaper,
  PanelsTopLeft,
  Pencil,
  Plus,
  Search,
  Settings,
  Shield,
  ShoppingBag,
  ShieldCheck,
  Star,
  Trash2,
  UsersRound,
  ArrowUpRight,
  X,
  LogOut,
  LockKeyhole,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import '../admin.css'
import {
  changeAdminPassword,
  createAdminAccount,
  fetchAdminAccounts,
  fetchCurrentAdmin,
  loginAdmin,
  logoutAdmin,
  deleteAdminAccount,
  setAdminAccountEnabled,
  updateAdminAccount,
} from '../data/adminAuthApi'
import { ADMIN_STORAGE_KEY, adminModules, createInitialAdminData } from '../data/adminData'
import { fetchHomePageContent, publishHomePageContent, saveHomePageContent, uploadImage } from '../data/homePageApi'
import { fetchClubPageContent, publishClubPageContent, saveClubPageContent } from '../data/clubPageApi'
import { fetchTeamPageContent, publishTeamPageContent, saveTeamPageContent } from '../data/teamPageApi'
import { deleteNewsArticle, fetchNewsArticles, publishNewsArticles, saveNewsArticle } from '../data/newsApi'
import { fetchContactPageContent, publishContactPageContent, saveContactPageContent } from '../data/contactPageApi'
import { fetchMatchPageContent, publishMatchPageContent, saveMatchPageContent } from '../data/matchPageApi'
import { fetchShopPageContent, getShopContentForAdmin, publishShopPageContent, saveShopPageContent } from '../data/shopPageApi'

const adminIcons = {
  PanelsTopLeft,
  Shield,
  UsersRound,
  CalendarDays,
  Newspaper,
  Images,
  ShoppingBag,
  ContactRound: Settings,
}

function readStoredData() {
  const saved = window.localStorage.getItem(ADMIN_STORAGE_KEY)
  return saved ? JSON.parse(saved) : createInitialAdminData()
}

function loadAdminData() {
  try {
    const saved = readStoredData()
    if (saved === null) return { data: createInitialAdminData(), error: '' }
    if (!saved || typeof saved !== 'object' || Array.isArray(saved)
      || adminModules.some((module) => saved[module.key] !== undefined && !Array.isArray(saved[module.key]))
      || (saved.pages !== undefined && !Array.isArray(saved.pages))) {
      throw new Error('Le format des données locales est invalide.')
    }
    const initialData = createInitialAdminData()
    const data = { ...initialData, ...saved }
    delete data.media
    if (Array.isArray(saved.settings) && saved.settings.some((item) => !item.group)) {
      const legacySettings = saved.settings[0]
      data.settings = initialData.settings.map((item) => item.group === 'contact'
        ? { ...item, phone: legacySettings.phone || item.phone, email: legacySettings.email || item.email, address: legacySettings.address || item.address }
        : item)
    }
    if (Array.isArray(saved.home) && saved.home.some((item) => !item.group)) {
      const legacyHero = saved.home.find((item) => item.id === 'home-hero')
      const legacyStory = saved.home.find((item) => item.id === 'home-intro')
      data.home = initialData.home.map((item) => {
        if (item.group === 'hero' && legacyHero) {
          const [headline, ...highlightedParts] = (legacyHero.title ?? '').split(',')
          return {
            ...item,
            headline: headline.trim() || item.headline,
            highlightedTitle: highlightedParts.join(',').trim() || item.highlightedTitle,
            description: legacyHero.description ?? item.description,
            image: legacyHero.image ?? item.image,
          }
        }
        if (item.group === 'story' && legacyStory) {
          return {
            ...item,
            title: legacyStory.title ?? item.title,
            description: legacyStory.description ?? item.description,
            image: legacyStory.image ?? item.image,
          }
        }
        return item
      })
    }
    if (Array.isArray(saved.pages)) {
      const migratePageItems = (page) => saved.pages
        .filter((item) => item.page === page)
        .map((item) => {
          const migratedItem = { ...item }
          delete migratedItem.page
          return migratedItem
        })
      if (saved.home === undefined) data.home = migratePageItems('Accueil')
      if (saved.club === undefined) data.club = migratePageItems('Le Club')
      delete data.pages
    }
    return { data, error: '' }
  } catch (error) {
    return {
      data: createInitialAdminData(),
      error: `Impossible de lire les données locales : ${error.message}`,
    }
  }
}

function FieldControl({ field, id, value, onChange, uploading, setUploading, options }) {
  if (field.type === 'checkbox') {
    return (
      <label className="admin-toggle">
        <input type="checkbox" checked={Boolean(value)} onChange={(event) => onChange(event.target.checked)} />
        <span className="admin-toggle__track" />
        <span>{field.label}</span>
      </label>
    )
  }

  if (field.type === 'select') {
    return (
      <select id={id} value={value ?? ''} required={field.required} onChange={(event) => onChange(event.target.value)}>
        <option value="" disabled>Choisir une option</option>
        {options.map((option, index) => {
          const optionValue = typeof option === 'string' ? option : option.id
          const optionLabel = typeof option === 'string'
            ? field.optionLabels?.[index] ?? option
            : option.name
          return <option key={optionValue} value={optionValue}>{optionLabel}</option>
        })}
      </select>
    )
  }

  if (field.type === 'textarea') {
    return <textarea id={id} value={value ?? ''} required={field.required} rows={4} onChange={(event) => onChange(event.target.value)} />
  }

  if (field.type === 'image') {
    return <ImageUploadControl id={id} value={value} onChange={onChange} uploading={uploading} setUploading={setUploading} />
  }

  if (field.type === 'images') {
    return <ImageGalleryUploadControl id={id} value={value} onChange={onChange} uploading={uploading} setUploading={setUploading} />
  }

  return (
    <input
      id={id}
      type={field.type || 'text'}
      value={value ?? ''}
      required={field.required}
      onChange={(event) => onChange(event.target.value)}
    />
  )
}

function ImageGalleryUploadControl({ id, value = [], onChange, uploading, setUploading }) {
  const [error, setError] = useState('')

  async function handleFileChange(event) {
    const files = Array.from(event.target.files ?? [])
    event.target.value = ''
    if (!files.length) return

    const invalidFile = files.find((file) => !['image/jpeg', 'image/png', 'image/gif'].includes(file.type))
    if (invalidFile) {
      setError('Format non accepté. Choisissez des images JPEG, PNG ou GIF.')
      return
    }
    if (files.some((file) => file.size > 10 * 1024 * 1024)) {
      setError('Chaque image ne doit pas dépasser 10 Mo.')
      return
    }

    setUploading(true)
    setError('')
    try {
      const uploadedImages = []
      for (const file of files) {
        uploadedImages.push(await uploadImage(file))
        onChange([...value, ...uploadedImages])
      }
    } catch (uploadError) {
      setError(`Échec du téléversement : ${uploadError.message}`)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="admin-image-gallery-upload">
      {value.length
        ? <div className="admin-image-gallery-upload__grid">{value.map((image, index) => (
          <div className="admin-image-gallery-upload__item" key={`${image}-${index}`}>
            <img src={image} alt={`Image ${index + 1} de la galerie`} />
            <button type="button" aria-label={`Retirer l’image ${index + 1}`} disabled={uploading} onClick={() => onChange(value.filter((_, imageIndex) => imageIndex !== index))}><X size={14} /></button>
          </div>
        ))}</div>
        : <div className="admin-image-upload__placeholder"><Images size={22} /><span>Aucune image dans la galerie</span></div>}
      <label className="admin-button admin-button--light" htmlFor={id}>
        {uploading ? <LoaderCircle className="admin-image-upload__spinner" size={15} /> : <ImagePlus size={15} />}
        {uploading ? 'Téléversement...' : 'Ajouter des images'}
      </label>
      <input id={id} className="admin-image-upload__input" type="file" accept="image/jpeg,image/png,image/gif" multiple disabled={uploading} onChange={handleFileChange} />
      <span className="admin-image-upload__hint">Images ajoutées également à la médiathèque du club · 10 Mo maximum par image</span>
      {error && <span className="admin-image-upload__error" role="alert">{error}</span>}
    </div>
  )
}

function ImageUploadControl({ id, value, onChange, uploading, setUploading }) {
  const [error, setError] = useState('')

  async function handleFileChange(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    if (file.type && !['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
      setError('Format non accepté. Choisissez une image JPEG, PNG ou GIF.')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('L’image ne doit pas dépasser 10 Mo.')
      return
    }

    setUploading(true)
    setError('')
    try {
      onChange(await uploadImage(file))
    } catch (uploadError) {
      setError(`Échec du téléversement : ${uploadError.message}`)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="admin-image-upload">
      {value
        ? <img className="admin-image-upload__preview" src={value} alt="Aperçu de l’image sélectionnée" />
        : <div className="admin-image-upload__placeholder"><ImagePlus size={22} /><span>Aucune image sélectionnée</span></div>}
      <div className="admin-image-upload__controls">
        <label className="admin-button admin-button--light" htmlFor={id}>
          {uploading ? <LoaderCircle className="admin-image-upload__spinner" size={15} /> : <ImagePlus size={15} />}
          {uploading ? 'Téléversement...' : value ? 'Changer l’image' : 'Choisir une image'}
        </label>
        <input
          id={id}
          className="admin-image-upload__input"
          type="file"
          accept="image/jpeg,image/png,image/gif"
          disabled={uploading}
          onChange={handleFileChange}
        />
        {value && (
          <button className="admin-button admin-button--light" type="button" disabled={uploading} onClick={() => onChange('')}>
            Retirer
          </button>
        )}
        <span className="admin-image-upload__hint">JPEG, PNG ou GIF · 10 Mo maximum</span>
      </div>
      {error && <span className="admin-image-upload__error" role="alert">{error}</span>}
    </div>
  )
}

function AdminEditor({ module, item, group, moduleItems, saving, onClose, onSave }) {
  const fields = module.fieldsBySection?.[item?.group ?? group] ?? module.fields
  const isMatchEditor = module.key === 'matches' && (item?.group ?? group) === 'matches'
  const [values, setValues] = useState(() => Object.fromEntries(
    fields.map((field) => [field.name, item?.[field.name] ?? (field.type === 'checkbox' ? field.defaultValue ?? false : field.type === 'images' ? [] : '')]),
  ))
  const isEditing = Boolean(item)
  const [uploading, setUploading] = useState(false)
  const [formError, setFormError] = useState('')
  const opponentName = moduleItems.find((entry) => entry.group === 'opponents' && entry.id === values.opponentId)?.name
  const homeTeamName = values.venueType === 'away' ? opponentName || 'Équipe adverse' : 'Guediawaye FC'
  const awayTeamName = values.venueType === 'away' ? 'Guediawaye FC' : opponentName || 'Équipe adverse'

  function updateField(name, value) {
    setFormError('')
    setValues((current) => ({ ...current, [name]: value }))
  }

  function submit(event) {
    event.preventDefault()
    if (fields.some((field) => (field.required || (field.requiredWhen && values[field.requiredWhen.field] === field.requiredWhen.value))
      && !String(values[field.name] ?? '').trim())) {
      setFormError('Veuillez remplir tous les champs obligatoires, y compris les images.')
      return
    }
    const generatedId = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`
    onSave({ ...item, ...values, ...(group ? { group } : {}), id: item?.id ?? `${module.key}-${generatedId}` })
  }

  return (
    <div className="admin-modal-backdrop" role="presentation" onMouseDown={(event) => !uploading && !saving && event.target === event.currentTarget && onClose()}>
      <section className="admin-editor" role="dialog" aria-modal="true" aria-labelledby="admin-editor-title">
        <header className="admin-editor__header">
          <div>
            <span className="admin-eyebrow">{isEditing ? 'MODIFICATION' : 'NOUVEAU CONTENU'}</span>
            <h2 id="admin-editor-title">{isEditing ? 'Modifier' : 'Ajouter'} — {module.sections?.find((section) => section.key === (item?.group ?? group))?.label ?? module.label}</h2>
          </div>
          <button className="admin-icon-button" type="button" aria-label="Fermer" disabled={uploading || saving} onClick={onClose}><X size={19} /></button>
        </header>
        <form className="admin-editor__form" onSubmit={submit}>
          <div className="admin-editor__fields">
            {fields.filter((field) => !field.requiredWhen || values[field.requiredWhen.field] === field.requiredWhen.value).map((field) => (
              <div className={`admin-field ${field.type === 'checkbox' ? 'admin-field--toggle' : ''}`} key={field.name}>
                {field.type !== 'checkbox' && <label htmlFor={`field-${field.name}`}>{isMatchEditor && field.name === 'homeScore'
                  ? `Score de ${homeTeamName} (si terminé)`
                  : isMatchEditor && field.name === 'awayScore'
                    ? `Score de ${awayTeamName} (si terminé)`
                    : field.label}{field.required && <span> *</span>}</label>}
                <FieldControl
                  field={field}
                  id={`field-${field.name}`}
                  value={values[field.name]}
                  onChange={(value) => updateField(field.name, value)}
                  uploading={uploading}
                  setUploading={setUploading}
                  options={field.optionsFrom
                    ? moduleItems.filter((entry) => entry.group === field.optionsFrom)
                    : field.options}
                />
              </div>
            ))}
          </div>
          {formError && <p className="admin-image-upload__error" role="alert">{formError}</p>}
          <div className="admin-editor__notice"><ShieldCheck size={16} /> {['home', 'news', 'settings', 'matches'].includes(module.key) ? 'Les changements seront enregistrés dans la base MySQL.' : 'Les changements sont enregistrés dans ce navigateur uniquement.'}</div>
          <footer className="admin-editor__actions">
            <button className="admin-button admin-button--light" type="button" disabled={saving || uploading} onClick={onClose}>Annuler</button>
            <button className="admin-button admin-button--primary" type="submit" disabled={saving || uploading}><Check size={16} /> {saving ? 'Enregistrement...' : uploading ? 'Téléversement...' : 'Enregistrer'}</button>
          </footer>
        </form>
      </section>
    </div>
  )
}

function isPastMatchMissingScore(item) {
  if (item.group !== 'matches' || !/^\d{4}-\d{2}-\d{2}$/.test(item.date ?? '')) return false

  const now = new Date()
  const today = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('-')

  return item.date < today
    && (!String(item.homeScore ?? '').trim() || !String(item.awayScore ?? '').trim())
}

function PreviewValue({ module, item, opponents = [], categories = [] }) {
  const group = item.group
  const image = module.itemImageSections?.includes(group)
    ? item[module.itemImageFields?.[group] ?? module.itemImageField]
    : item.image
  const titleFields = module.itemLabelFields?.[group] ?? ['title', 'name', 'section', 'clubName']
  const detailFields = module.itemDetailFields?.[group] ?? ['category', 'role', 'page', 'date', 'competition', 'price']
  const defaultTitle = group === 'manager'
    ? [item.firstName, item.lastName].filter(Boolean).join(' ') || 'Gérant de la boutique'
    : titleFields.map((field) => item[field]).find(Boolean) || 'Contenu sans titre'
  const opponentName = group === 'matches'
    ? opponents.find((opponent) => opponent.id === item.opponentId)?.name
    : ''
  const title = group === 'matches' ? opponentName || defaultTitle : defaultTitle
  const detail = group === 'matches'
    ? [item.date, ...detailFields.map((field) => item[field])].filter(Boolean).join(' · ')
    : detailFields.map((field) => field === 'categoryId'
      ? categories.find((category) => category.id === item.categoryId)?.name
      : item[field]).filter(Boolean).join(' · ')
  return (
    <div className="admin-content-preview">
      {image ? <img src={image} alt="" /> : <div className="admin-content-preview__fallback">{module.label.slice(0, 1)}</div>}
      <div className="admin-content-preview__copy">
        <strong>{title}</strong>
        {detail && <span>{detail}</span>}
      </div>
    </div>
  )
}

function Dashboard({ data, onOpenModule }) {
  const stats = [
    { label: 'Contenus gérés', value: Object.values(data).reduce((total, items) => total + items.length, 0), icon: FilePlus2, trend: 'Rubriques du site' },
    { label: 'Actualités', value: data.news?.length ?? 0, icon: Activity, trend: 'Articles enregistrés' },
    { label: 'Matchs', value: data.matches?.filter((item) => item.group === 'matches').length ?? 0, icon: Clock3, trend: 'Dans le calendrier' },
    { label: 'Questions fréquentes', value: data.settings?.filter((item) => item.group === 'faq').length ?? 0, icon: Settings, trend: 'Dans la page contact' },
  ]
  const recent = adminModules.flatMap((module) => (data[module.key] ?? []).map((item) => ({ module, item })))
    .slice(0, 5)

  return (
    <>
      <div className="admin-welcome">
        <div>
          <span className="admin-eyebrow">ESPACE ADMINISTRATEUR</span>
          <h1>Bonjour, administrateur <span>👋</span></h1>
          <p>Retrouvez et gérez les contenus du Guediawaye FC depuis un seul endroit.</p>
        </div>
        <div className="admin-welcome__date"><Clock3 size={15} /> Données enregistrées localement</div>
      </div>
      <div className="admin-stats">
        {stats.map(({ label, value, icon: Icon, trend }, index) => (
          <article className="admin-stat-card" key={label}>
            <div className={`admin-stat-card__icon admin-stat-card__icon--${index}`}><Icon size={19} /></div>
            <span>{label}</span>
            <strong>{value}</strong>
            <small>{trend}</small>
          </article>
        ))}
      </div>
      <div className="admin-dashboard-grid">
        <section className="admin-panel admin-quick-actions">
          <div className="admin-panel__heading"><div><h2>Accès rapides</h2><p>Choisissez une rubrique pour commencer.</p></div></div>
          <div className="admin-quick-actions__grid">
            {adminModules.slice(0, 6).map((module) => {
              const Icon = adminIcons[module.icon] ?? LayoutDashboard
              return (
                <button type="button" key={module.key} onClick={() => onOpenModule(module.key)}>
                  <span><Icon size={18} /></span>
                  <strong>{module.label}</strong>
                  <small>{(data[module.key] ?? []).length} éléments</small>
                  <ChevronRight size={16} />
                </button>
              )
            })}
          </div>
        </section>
        <section className="admin-panel admin-recent">
          <div className="admin-panel__heading"><div><h2>Quelques contenus</h2><p>Ouvrez une rubrique pour gérer ses éléments.</p></div></div>
          <div className="admin-recent__list">
            {recent.map(({ module, item }, index) => (
              <button type="button" key={`${module.key}-${item.id}`} onClick={() => onOpenModule(module.key)}>
                <span className={`admin-recent__icon admin-recent__icon--${index % 4}`}><FilePlus2 size={16} /></span>
                <span><strong>{item.title || item.name || item.label || item.section || item.clubName || module.label}</strong><small>{module.sections?.find((section) => section.key === item.group)?.label ?? module.label}</small></span>
                <ChevronRight size={15} />
              </button>
            ))}
          </div>
        </section>
      </div>
      <section className="admin-tip"><span><ShieldCheck size={20} /></span><div><strong>Accès protégé</strong><p>Les changements sont publiés via le backend. Les comptes, rôles, mots de passe hachés et sessions sont contrôlés par le serveur.</p></div><ArrowUpRight size={18} /></section>
    </>
  )
}

function AdminLoginScreen({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function submit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await onLogin(username.trim(), password)
    } catch (loginError) {
      setError(loginError.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="admin-auth">
      <form className="admin-auth__card" onSubmit={submit}>
        <img src="/logo-1.png" alt="Guediawaye FC" />
        <span className="admin-eyebrow">ESPACE SÉCURISÉ</span>
        <h1>Connexion administrateur</h1>
        <p>Identifiez-vous pour accéder à la gestion du site.</p>
        {error && <div className="admin-alert" role="alert">{error}</div>}
        <label>Identifiant<input autoComplete="username" required value={username} onChange={(event) => setUsername(event.target.value)} /></label>
        <label>Mot de passe<input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} /></label>
        <button className="admin-button admin-button--primary" type="submit" disabled={submitting}>
          {submitting ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>
    </main>
  )
}

function AdminPasswordPanel({ user, onUserUpdated, forced = false }) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [saving, setSaving] = useState(false)

  async function submit(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    setNotice('')
    try {
      const updated = await changeAdminPassword(currentPassword, newPassword)
      onUserUpdated(updated)
      setCurrentPassword('')
      setNewPassword('')
      setNotice('Votre mot de passe a été modifié.')
    } catch (changeError) {
      setError(changeError.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="admin-access-panel">
      <div className="admin-page-heading">
        <div className="admin-page-heading__title"><span className="admin-page-icon"><LockKeyhole size={20} /></span><div><span className="admin-eyebrow">SÉCURITÉ DU COMPTE</span><h1>{forced ? 'Changez votre mot de passe' : 'Modifier mon mot de passe'}</h1><p>{forced ? 'Pour protéger votre compte, choisissez un nouveau mot de passe avant de continuer.' : `Compte : ${user.username}`}</p></div></div>
      </div>
      {error && <div className="admin-alert" role="alert">{error}</div>}
      {notice && <div className="admin-auth-success" role="status">{notice}</div>}
      <form className="admin-access-form" onSubmit={submit}>
        <label>Mot de passe actuel<input type="password" autoComplete="current-password" required value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} /></label>
        <label>Nouveau mot de passe<input type="password" autoComplete="new-password" minLength={12} required value={newPassword} onChange={(event) => setNewPassword(event.target.value)} /><small>12 caractères minimum, avec majuscule, minuscule, chiffre et caractère spécial.</small></label>
        <button className="admin-button admin-button--primary" type="submit" disabled={saving}>{saving ? 'Enregistrement...' : 'Enregistrer le mot de passe'}</button>
      </form>
    </section>
  )
}

function AdminAccountsPanel() {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [updatingId, setUpdatingId] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ username: '', displayName: '', password: '' })
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [form, setForm] = useState({ username: '', displayName: '', password: '' })

  async function loadAccounts() {
    setLoading(true)
    setError('')
    try {
      setAccounts(await fetchAdminAccounts())
    } catch (loadError) {
      setError(loadError.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let active = true
    fetchAdminAccounts()
      .then((loadedAccounts) => {
        if (active) setAccounts(loadedAccounts)
      })
      .catch((loadError) => {
        if (active) setError(loadError.message)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => { active = false }
  }, [])

  async function submit(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    setNotice('')
    try {
      const created = await createAdminAccount(form)
      setAccounts((current) => [...current, created])
      setForm({ username: '', displayName: '', password: '' })
      setNotice('Le profil administrateur a été créé.')
    } catch (createError) {
      setError(createError.message)
    } finally {
      setSaving(false)
    }
  }

  async function toggleAccount(account) {
    setUpdatingId(account.id)
    setError('')
    setNotice('')
    try {
      const updated = await setAdminAccountEnabled(account.id, !account.enabled)
      setAccounts((current) => current.map((item) => item.id === updated.id ? updated : item))
      setNotice(updated.enabled ? 'Le profil a été réactivé.' : 'Le profil a été bloqué.')
    } catch (updateError) {
      setError(updateError.message)
    } finally {
      setUpdatingId(null)
    }
  }

  function startEditing(account) {
    setEditingId(account.id)
    setEditForm({ username: account.username, displayName: account.displayName, password: '' })
    setError('')
    setNotice('')
  }

  async function saveAccount(event) {
    event.preventDefault()
    setUpdatingId(editingId)
    setError('')
    setNotice('')
    try {
      const updated = await updateAdminAccount(editingId, editForm)
      setAccounts((current) => current.map((item) => item.id === updated.id ? updated : item))
      setEditingId(null)
      setEditForm({ username: '', displayName: '', password: '' })
      setNotice(updated.passwordChangeRequired
        ? 'Profil modifié. Le nouveau mot de passe devra être changé à la prochaine connexion.'
        : 'Profil administrateur modifié.')
    } catch (updateError) {
      setError(updateError.message)
    } finally {
      setUpdatingId(null)
    }
  }

  async function removeAccount(account) {
    if (!window.confirm(`Supprimer définitivement le profil « ${account.displayName} » ?`)) return
    setUpdatingId(account.id)
    setError('')
    setNotice('')
    try {
      await deleteAdminAccount(account.id)
      setAccounts((current) => current.filter((item) => item.id !== account.id))
      if (editingId === account.id) setEditingId(null)
      setNotice('Le profil administrateur a été supprimé.')
    } catch (deleteError) {
      setError(deleteError.message)
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <section className="admin-access-panel">
      <div className="admin-page-heading">
        <div className="admin-page-heading__title"><span className="admin-page-icon"><UsersRound size={20} /></span><div><span className="admin-eyebrow">ACCÈS AU SITE</span><h1>Profils administrateur</h1><p>Créez jusqu’à trois profils, ou bloquez/réactivez un accès.</p></div></div>
        <span className="admin-access-count">{accounts.length} / 3 profils</span>
      </div>
      {error && <div className="admin-alert" role="alert">{error}<button type="button" className="admin-alert__retry" onClick={loadAccounts}>Réessayer</button></div>}
      {notice && <div className="admin-auth-success" role="status">{notice}</div>}
      <div className="admin-account-list">
        {loading ? <p>Chargement des profils...</p> : accounts.length ? accounts.map((account) => (
          <article className="admin-account-card" key={account.id}>
            <span className={`admin-account-card__status ${account.enabled ? 'is-enabled' : 'is-disabled'}`} />
            <div><strong>{account.displayName}</strong><small>@{account.username} · {account.enabled ? 'Actif' : 'Bloqué'}</small></div>
            <div className="admin-account-card__actions">
              <button type="button" className="admin-button admin-button--muted" disabled={updatingId === account.id} onClick={() => startEditing(account)}>Modifier</button>
              <button type="button" className={`admin-button ${account.enabled ? 'admin-button--muted' : 'admin-button--primary'}`} disabled={updatingId === account.id} onClick={() => toggleAccount(account)}>{updatingId === account.id ? 'Mise à jour...' : account.enabled ? 'Bloquer' : 'Réactiver'}</button>
              <button type="button" className="admin-button admin-button--danger" disabled={updatingId === account.id} onClick={() => removeAccount(account)}>Supprimer</button>
            </div>
            {editingId === account.id && (
              <form className="admin-access-form admin-account-edit" onSubmit={saveAccount}>
                <h2>Modifier le profil</h2>
                <label>Nom affiché<input required maxLength={100} value={editForm.displayName} onChange={(event) => setEditForm((current) => ({ ...current, displayName: event.target.value }))} /></label>
                <label>Identifiant<input required maxLength={50} pattern="[a-zA-Z0-9._-]+" autoComplete="username" value={editForm.username} onChange={(event) => setEditForm((current) => ({ ...current, username: event.target.value }))} /></label>
                <label>Nouveau mot de passe (facultatif)<input type="password" minLength={12} autoComplete="new-password" value={editForm.password} onChange={(event) => setEditForm((current) => ({ ...current, password: event.target.value }))} /><small>Laissez vide pour le conserver. Un nouveau mot de passe devra être changé à la prochaine connexion.</small></label>
                <div className="admin-account-edit__actions"><button type="button" className="admin-button admin-button--muted" onClick={() => setEditingId(null)}>Annuler</button><button className="admin-button admin-button--primary" type="submit" disabled={updatingId === account.id}>{updatingId === account.id ? 'Enregistrement...' : 'Enregistrer'}</button></div>
              </form>
            )}
          </article>
        )) : <p>Aucun profil secondaire n’a été créé.</p>}
      </div>
      {!loading && !error && accounts.length < 3 && (
        <form className="admin-access-form" onSubmit={submit}>
          <h2>Créer un profil</h2>
          <label>Nom affiché<input required maxLength={100} value={form.displayName} onChange={(event) => setForm((current) => ({ ...current, displayName: event.target.value }))} /></label>
          <label>Identifiant<input required maxLength={50} pattern="[a-zA-Z0-9._-]+" autoComplete="username" value={form.username} onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))} /></label>
          <label>Mot de passe initial<input type="password" required minLength={12} autoComplete="new-password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} /><small>12 caractères minimum, avec majuscule, minuscule, chiffre et caractère spécial.</small></label>
          <button className="admin-button admin-button--primary" type="submit" disabled={saving}>{saving ? 'Création...' : 'Créer le profil'}</button>
        </form>
      )}
    </section>
  )
}

function AdminWorkspace({ user, onLogout, onUserUpdated }) {
  const [initialState] = useState(loadAdminData)
  const [data, setData] = useState(initialState.data)
  const [activeKey, setActiveKey] = useState('dashboard')
  const [activeSection, setActiveSection] = useState('hero')
  const [search, setSearch] = useState('')
  const [editorItem, setEditorItem] = useState(null)
  const [isCreating, setIsCreating] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notice, setNotice] = useState('')
  const [storageError, setStorageError] = useState(initialState.error)
  const [apiError, setApiError] = useState('')
  const [apiStatus, setApiStatus] = useState('loading')
  const [clubApiError, setClubApiError] = useState('')
  const [clubApiStatus, setClubApiStatus] = useState('loading')
  const [teamApiError, setTeamApiError] = useState('')
  const [teamApiStatus, setTeamApiStatus] = useState('loading')
  const [newsApiError, setNewsApiError] = useState('')
  const [newsApiStatus, setNewsApiStatus] = useState('loading')
  const [contactApiError, setContactApiError] = useState('')
  const [contactApiStatus, setContactApiStatus] = useState('loading')
  const [matchesApiError, setMatchesApiError] = useState('')
  const [matchesApiStatus, setMatchesApiStatus] = useState('loading')
  const [shopApiError, setShopApiError] = useState('')
  const [shopApiStatus, setShopApiStatus] = useState('loading')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let active = true
    fetchHomePageContent()
      .then((home) => {
        if (!active) return
        setData((current) => ({ ...current, home }))
        setApiStatus('ready')
        publishHomePageContent(home)
      })
      .catch((error) => {
        if (!active) return
        setApiStatus('error')
        setApiError(`Impossible de charger le contenu d’accueil depuis le backend : ${error.message}`)
      })

    fetchClubPageContent()
      .then((club) => {
        if (!active) return
        setData((current) => ({ ...current, club }))
        setClubApiStatus('ready')
        publishClubPageContent(club)
      })
      .catch((error) => {
        if (!active) return
        setClubApiStatus('error')
        setClubApiError(`Impossible de charger le contenu du club depuis le backend : ${error.message}`)
      })

    fetchTeamPageContent()
      .then((team) => {
        if (!active) return
        setData((current) => ({ ...current, team }))
        setTeamApiStatus('ready')
        publishTeamPageContent(team)
      })
      .catch((error) => {
        if (!active) return
        setTeamApiStatus('error')
        setTeamApiError(`Impossible de charger le contenu équipe depuis le backend : ${error.message}`)
      })

    fetchNewsArticles()
      .then((news) => {
        if (!active) return
        setData((current) => ({ ...current, news }))
        setNewsApiStatus('ready')
        publishNewsArticles(news)
      })
      .catch((error) => {
        if (!active) return
        setNewsApiStatus('error')
        setNewsApiError(`Impossible de charger les actualités depuis le backend : ${error.message}`)
      })

    fetchContactPageContent()
      .then((settings) => {
        if (!active) return
        setData((current) => ({ ...current, settings }))
        setContactApiStatus('ready')
        publishContactPageContent(settings)
      })
      .catch((error) => {
        if (!active) return
        setContactApiStatus('error')
        setContactApiError(`Impossible de charger les informations de contact depuis le backend : ${error.message}`)
      })

    fetchMatchPageContent()
      .then((content) => {
        if (!active) return
        setData((current) => ({
          ...current,
          matches: [
            ...content.opponents.map((opponent) => ({ ...opponent, group: 'opponents' })),
            ...content.matches.map((match) => ({ ...match, group: 'matches' })),
          ],
        }))
        setMatchesApiStatus('ready')
        publishMatchPageContent(content)
      })
      .catch((error) => {
        if (!active) return
        setMatchesApiStatus('error')
        setMatchesApiError(`Impossible de charger le calendrier depuis le backend : ${error.message}`)
      })

    fetchShopPageContent()
      .then((shop) => {
        if (!active) return
        setData((current) => ({ ...current, shop: getShopContentForAdmin(shop) }))
        setShopApiStatus('ready')
        publishShopPageContent(shop)
      })
      .catch((error) => {
        if (!active) return
        setShopApiStatus('error')
        setShopApiError(`Impossible de charger la boutique depuis le backend : ${error.message}`)
      })

    return () => {
      active = false
    }
  }, [])

  async function loadHomeFromApi() {
    setApiStatus('loading')
    setApiError('')
    try {
      const home = await fetchHomePageContent()
      setData((current) => ({ ...current, home }))
      setApiStatus('ready')
      publishHomePageContent(home)
    } catch (error) {
      setApiStatus('error')
      setApiError(`Impossible de charger le contenu d’accueil depuis le backend : ${error.message}`)
    }
  }

  async function loadClubFromApi() {
    setClubApiStatus('loading')
    setClubApiError('')
    try {
      const club = await fetchClubPageContent()
      setData((current) => ({ ...current, club }))
      setClubApiStatus('ready')
      publishClubPageContent(club)
    } catch (error) {
      setClubApiStatus('error')
      setClubApiError(`Impossible de charger le contenu du club depuis le backend : ${error.message}`)
    }
  }

  async function loadTeamFromApi() {
    setTeamApiStatus('loading')
    setTeamApiError('')
    try {
      const team = await fetchTeamPageContent()
      setData((current) => ({ ...current, team }))
      setTeamApiStatus('ready')
      publishTeamPageContent(team)
    } catch (error) {
      setTeamApiStatus('error')
      setTeamApiError(`Impossible de charger le contenu équipe depuis le backend : ${error.message}`)
    }
  }

  async function loadNewsFromApi() {
    setNewsApiStatus('loading')
    setNewsApiError('')
    try {
      const news = await fetchNewsArticles()
      setData((current) => ({ ...current, news }))
      setNewsApiStatus('ready')
      publishNewsArticles(news)
    } catch (error) {
      setNewsApiStatus('error')
      setNewsApiError(`Impossible de charger les actualités depuis le backend : ${error.message}`)
    }
  }

  async function loadContactFromApi() {
    setContactApiStatus('loading')
    setContactApiError('')
    try {
      const settings = await fetchContactPageContent()
      setData((current) => ({ ...current, settings }))
      setContactApiStatus('ready')
      publishContactPageContent(settings)
    } catch (error) {
      setContactApiStatus('error')
      setContactApiError(`Impossible de charger les informations de contact depuis le backend : ${error.message}`)
    }
  }

  async function loadMatchesFromApi() {
    setMatchesApiStatus('loading')
    setMatchesApiError('')
    try {
      const content = await fetchMatchPageContent()
      setData((current) => ({
        ...current,
        matches: [
          ...content.opponents.map((opponent) => ({ ...opponent, group: 'opponents' })),
          ...content.matches.map((match) => ({ ...match, group: 'matches' })),
        ],
      }))
      setMatchesApiStatus('ready')
      publishMatchPageContent(content)
    } catch (error) {
      setMatchesApiStatus('error')
      setMatchesApiError(`Impossible de charger le calendrier depuis le backend : ${error.message}`)
    }
  }

  async function loadShopFromApi() {
    setShopApiStatus('loading')
    setShopApiError('')
    try {
      const shop = await fetchShopPageContent()
      setData((current) => ({ ...current, shop: getShopContentForAdmin(shop) }))
      setShopApiStatus('ready')
      publishShopPageContent(shop)
    } catch (error) {
      setShopApiStatus('error')
      setShopApiError(`Impossible de charger la boutique depuis le backend : ${error.message}`)
    }
  }

  const activeModule = adminModules.find((module) => module.key === activeKey)
  const items = data[activeKey] ?? []
  const activeSectionDefinition = activeModule?.sections?.find((section) => section.key === activeSection)
  const sectionItems = activeSectionDefinition
    ? items.filter((item) => item.group === activeSection)
    : items
  if (activeKey === 'matches' && activeSection === 'matches') {
    sectionItems.sort((first, second) => String(second.date ?? '').localeCompare(String(first.date ?? '')))
  }
  const clubFigureCount = activeKey === 'club'
    ? items.filter((item) => item.group === 'figures').length
    : 0
  const clubFigureLimitReached = activeKey === 'club'
    && activeSection === 'figures'
    && clubFigureCount >= 9
  const query = search.trim().toLocaleLowerCase('fr')
  const searchFields = activeModule?.itemSearchFields
  const filteredItems = query
    ? sectionItems.filter((item) => (searchFields
      ? searchFields.map((field) => item[field])
      : Object.values(item)).some((value) => String(value ?? '').toLocaleLowerCase('fr').includes(query)))
    : sectionItems
  const activeApiStatus = activeKey === 'news'
    ? newsApiStatus
    : activeKey === 'club'
      ? clubApiStatus
      : activeKey === 'team'
        ? teamApiStatus
        : activeKey === 'settings'
          ? contactApiStatus
          : activeKey === 'matches'
            ? matchesApiStatus
            : activeKey === 'shop'
              ? shopApiStatus
            : apiStatus

  function persist(nextData, message) {
    try {
      window.localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(nextData))
      setData(nextData)
      setStorageError('')
      setNotice(message)
      window.setTimeout(() => setNotice(''), 3000)
      return true
    } catch (error) {
      setStorageError(`Impossible d’enregistrer les données locales : ${error.message}`)
      return false
    }
  }

  function showNotice(message) {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 3000)
  }

  async function saveItem(item) {
    const currentItems = data[activeKey] ?? []
    const exists = currentItems.some((current) => current.id === item.id)
    if (activeKey === 'club'
      && item.group === 'figures'
      && !exists
      && currentItems.filter((current) => current.group === 'figures').length >= 9) {
      setClubApiError('La page du club ne peut pas contenir plus de 9 figures.')
      return
    }
    if (activeKey === 'news' && item.featured && !currentItems.find((current) => current.id === item.id)?.featured
      && currentItems.filter((current) => current.featured).length >= 3) {
      showNotice('Vous pouvez mettre au maximum 3 actualités en avant sur la page d’accueil.')
      return
    }
    if (activeKey === 'matches' && item.group === 'matches' && item.status === 'live'
      && currentItems.some((current) => current.group === 'matches' && current.status === 'live' && current.id !== item.id)) {
      showNotice('Un seul match peut être indiqué comme étant en cours.')
      return
    }
    const nextData = {
      ...data,
      [activeKey]: exists
        ? currentItems.map((current) => current.id === item.id ? item : current)
        : [item, ...currentItems],
    }
    if (activeKey === 'news') {
      setSaving(true)
      setNewsApiStatus('saving')
      try {
        const savedArticle = await saveNewsArticle(item)
        const news = exists
          ? currentItems.map((current) => current.id === item.id ? savedArticle : current)
          : [savedArticle, ...currentItems]
        setData((current) => ({ ...current, news }))
        setNewsApiError('')
        setNewsApiStatus('ready')
        publishNewsArticles(news)
        showNotice(exists ? 'L’actualité a été modifiée dans MySQL.' : 'L’actualité a été ajoutée dans MySQL.')
        setEditorItem(null)
        setIsCreating(false)
      } catch (error) {
        setNewsApiError(`Impossible d’enregistrer l’actualité : ${error.message}`)
        setNewsApiStatus('error')
      } finally {
        setSaving(false)
      }
      return
    }
    if (activeKey === 'settings') {
      setSaving(true)
      setContactApiStatus('saving')
      try {
        const settings = await saveContactPageContent(nextData.settings)
        setData((current) => ({ ...current, settings }))
        setContactApiError('')
        setContactApiStatus('ready')
        publishContactPageContent(settings)
        showNotice(exists
          ? 'Les informations de contact ont été synchronisées avec MySQL.'
          : 'La question fréquente a été ajoutée et synchronisée avec MySQL.')
        setEditorItem(null)
        setIsCreating(false)
      } catch (error) {
        setContactApiError(`Impossible d’enregistrer le contenu de la page contact : ${error.message}`)
        setContactApiStatus('error')
      } finally {
        setSaving(false)
      }
      return
    }
    if (activeKey === 'matches') {
      setSaving(true)
      setMatchesApiStatus('saving')
      try {
        const content = {
          opponents: nextData.matches.filter((entry) => entry.group === 'opponents'),
          matches: nextData.matches.filter((entry) => entry.group === 'matches'),
        }
        const savedContent = await saveMatchPageContent(content)
        const matches = [
          ...savedContent.opponents.map((opponent) => ({ ...opponent, group: 'opponents' })),
          ...savedContent.matches.map((match) => ({ ...match, group: 'matches' })),
        ]
        setData((current) => ({ ...current, matches }))
        setMatchesApiError('')
        setMatchesApiStatus('ready')
        publishMatchPageContent(savedContent)
        showNotice(exists
          ? 'Les modifications du calendrier ont été synchronisées avec MySQL.'
          : item.group === 'opponents'
            ? 'L’équipe adverse a été ajoutée et synchronisée avec MySQL.'
            : 'Le match a été ajouté et synchronisé avec MySQL.')
        setEditorItem(null)
        setIsCreating(false)
      } catch (error) {
        setMatchesApiError(`Impossible d’enregistrer le calendrier : ${error.message}`)
        setMatchesApiStatus('error')
      } finally {
        setSaving(false)
      }
      return
    }
    if (activeKey === 'shop') {
      setSaving(true)
      setShopApiStatus('saving')
      try {
        const content = {
          manager: nextData.shop.find((entry) => entry.group === 'manager'),
          categories: nextData.shop.filter((entry) => entry.group === 'categories'),
          products: nextData.shop.filter((entry) => entry.group === 'products'),
        }
        const savedShop = await saveShopPageContent(content)
        const shop = getShopContentForAdmin(savedShop)
        setData((current) => ({ ...current, shop }))
        setShopApiError('')
        setShopApiStatus('ready')
        publishShopPageContent(savedShop)
        showNotice(exists
          ? 'Les modifications de la boutique ont été synchronisées avec MySQL.'
          : item.group === 'products'
            ? 'Le produit a été ajouté et synchronisé avec MySQL.'
            : 'La catégorie a été ajoutée et synchronisée avec MySQL.')
        setEditorItem(null)
        setIsCreating(false)
      } catch (error) {
        setShopApiError(`Impossible d’enregistrer la boutique : ${error.message}`)
        setShopApiStatus('error')
      } finally {
        setSaving(false)
      }
      return
    }
    if (activeKey === 'home' || activeKey === 'club' || activeKey === 'team') {
      setSaving(true)
      if (activeKey === 'home') setApiStatus('saving')
      else if (activeKey === 'club') setClubApiStatus('saving')
      else setTeamApiStatus('saving')
      try {
        if (activeKey === 'home') {
          const home = await saveHomePageContent(nextData.home)
          setData((current) => ({ ...current, home }))
          setApiError('')
          setApiStatus('ready')
          publishHomePageContent(home)
          showNotice(exists ? 'Les modifications de la page d’accueil ont été synchronisées avec MySQL.' : 'Le contenu a été synchronisé avec MySQL.')
        } else if (activeKey === 'club') {
          const club = await saveClubPageContent(nextData.club)
          setData((current) => ({ ...current, club }))
          setClubApiError('')
          setClubApiStatus('ready')
          publishClubPageContent(club)
          showNotice(exists ? 'Les modifications du club ont été synchronisées avec MySQL.' : 'Le contenu du club a été synchronisé avec MySQL.')
        } else {
          const team = await saveTeamPageContent(nextData.team)
          setData((current) => ({ ...current, team }))
          setTeamApiError('')
          setTeamApiStatus('ready')
          publishTeamPageContent(team)
          showNotice(exists ? 'Les modifications de l’équipe ont été synchronisées avec MySQL.' : 'Le contenu de l’équipe a été synchronisé avec MySQL.')
        }
        setEditorItem(null)
        setIsCreating(false)
      } catch (error) {
        if (activeKey === 'home') {
          setApiError(`Impossible d’enregistrer le contenu d’accueil : ${error.message}`)
          setApiStatus('error')
        } else if (activeKey === 'club') {
          setClubApiError(`Impossible d’enregistrer le contenu du club : ${error.message}`)
          setClubApiStatus('error')
        } else {
          setTeamApiError(`Impossible d’enregistrer le contenu de l’équipe : ${error.message}`)
          setTeamApiStatus('error')
        }
      } finally {
        setSaving(false)
      }
      return
    }
    if (persist(nextData, exists ? 'Les modifications ont été enregistrées.' : 'Le contenu a été ajouté.')) {
      setEditorItem(null)
      setIsCreating(false)
    }
  }

  async function deleteItem(item) {
    if (activeKey === 'matches' && item.group === 'opponents'
      && items.some((entry) => entry.group === 'matches' && entry.opponentId === item.id)) {
      showNotice('Cette équipe est utilisée par un ou plusieurs matchs. Modifiez ou supprimez ces matchs avant de retirer l’équipe.')
      return
    }
    if (activeKey === 'shop' && item.group === 'categories'
      && items.some((entry) => entry.group === 'products' && entry.categoryId === item.id)) {
      showNotice('Cette catégorie est utilisée par un ou plusieurs produits. Modifiez ou supprimez ces produits avant de retirer la catégorie.')
      return
    }
    if (activeKey === 'shop' && item.group === 'categories'
      && items.filter((entry) => entry.group === 'categories').length === 1) {
      showNotice('La boutique doit conserver au moins une catégorie.')
      return
    }
    const confirmed = window.confirm(activeKey === 'home'
      ? 'Supprimer cet élément de la page d’accueil ?'
      : activeKey === 'club'
        ? 'Supprimer cet élément de la page du club ?'
        : activeKey === 'news'
          ? 'Supprimer définitivement cette actualité ?'
        : 'Supprimer cet élément ? Cette action est définitive pour les données locales.')
    if (!confirmed) return
    const nextData = { ...data, [activeKey]: items.filter((current) => current.id !== item.id) }
    if (activeKey === 'news') {
      setSaving(true)
      setNewsApiStatus('saving')
      try {
        await deleteNewsArticle(item.id)
        setData((current) => ({ ...current, news: nextData.news }))
        setNewsApiError('')
        setNewsApiStatus('ready')
        publishNewsArticles(nextData.news)
        showNotice('L’actualité a été supprimée de MySQL.')
      } catch (error) {
        setNewsApiError(`Impossible de supprimer l’actualité : ${error.message}`)
        setNewsApiStatus('error')
      } finally {
        setSaving(false)
      }
      return
    }
    if (activeKey === 'settings') {
      setSaving(true)
      setContactApiStatus('saving')
      try {
        const settings = await saveContactPageContent(nextData.settings)
        setData((current) => ({ ...current, settings }))
        setContactApiError('')
        setContactApiStatus('ready')
        publishContactPageContent(settings)
        showNotice('La question fréquente a été supprimée et synchronisée avec MySQL.')
      } catch (error) {
        setContactApiError(`Impossible de supprimer le contenu de la page contact : ${error.message}`)
        setContactApiStatus('error')
      } finally {
        setSaving(false)
      }
      return
    }
    if (activeKey === 'matches') {
      setSaving(true)
      setMatchesApiStatus('saving')
      try {
        const content = {
          opponents: nextData.matches.filter((entry) => entry.group === 'opponents'),
          matches: nextData.matches.filter((entry) => entry.group === 'matches'),
        }
        const savedContent = await saveMatchPageContent(content)
        const matches = [
          ...savedContent.opponents.map((opponent) => ({ ...opponent, group: 'opponents' })),
          ...savedContent.matches.map((match) => ({ ...match, group: 'matches' })),
        ]
        setData((current) => ({ ...current, matches }))
        setMatchesApiError('')
        setMatchesApiStatus('ready')
        publishMatchPageContent(savedContent)
        showNotice(item.group === 'opponents'
          ? 'L’équipe adverse a été supprimée et synchronisée avec MySQL.'
          : 'Le match a été supprimé et synchronisé avec MySQL.')
      } catch (error) {
        setMatchesApiError(`Impossible de supprimer cet élément du calendrier : ${error.message}`)
        setMatchesApiStatus('error')
      } finally {
        setSaving(false)
      }
      return
    }
    if (activeKey === 'shop') {
      setSaving(true)
      setShopApiStatus('saving')
      try {
        const content = {
          manager: nextData.shop.find((entry) => entry.group === 'manager'),
          categories: nextData.shop.filter((entry) => entry.group === 'categories'),
          products: nextData.shop.filter((entry) => entry.group === 'products'),
        }
        const savedShop = await saveShopPageContent(content)
        const shop = getShopContentForAdmin(savedShop)
        setData((current) => ({ ...current, shop }))
        setShopApiError('')
        setShopApiStatus('ready')
        publishShopPageContent(savedShop)
        showNotice(item.group === 'products'
          ? 'Le produit a été supprimé et synchronisé avec MySQL.'
          : 'La catégorie a été supprimée et synchronisée avec MySQL.')
      } catch (error) {
        setShopApiError(`Impossible de supprimer cet élément de la boutique : ${error.message}`)
        setShopApiStatus('error')
      } finally {
        setSaving(false)
      }
      return
    }
    if (activeKey === 'home' || activeKey === 'club' || activeKey === 'team') {
      setSaving(true)
      if (activeKey === 'home') setApiStatus('saving')
      else if (activeKey === 'club') setClubApiStatus('saving')
      else setTeamApiStatus('saving')
      try {
        if (activeKey === 'home') {
          const home = await saveHomePageContent(nextData.home)
          setData((current) => ({ ...current, home }))
          setApiError('')
          setApiStatus('ready')
          publishHomePageContent(home)
          showNotice('Le contenu a été supprimé et synchronisé avec MySQL.')
        } else if (activeKey === 'club') {
          const club = await saveClubPageContent(nextData.club)
          setData((current) => ({ ...current, club }))
          setClubApiError('')
          setClubApiStatus('ready')
          publishClubPageContent(club)
          showNotice('Le contenu du club a été supprimé et synchronisé avec MySQL.')
        } else {
          const team = await saveTeamPageContent(nextData.team)
          setData((current) => ({ ...current, team }))
          setTeamApiError('')
          setTeamApiStatus('ready')
          publishTeamPageContent(team)
          showNotice('Le contenu de l’équipe a été supprimé et synchronisé avec MySQL.')
        }
      } catch (error) {
        if (activeKey === 'home') {
          setApiError(`Impossible de supprimer le contenu d’accueil : ${error.message}`)
          setApiStatus('error')
        } else if (activeKey === 'club') {
          setClubApiError(`Impossible de supprimer le contenu du club : ${error.message}`)
          setClubApiStatus('error')
        } else {
          setTeamApiError(`Impossible de supprimer le contenu de l’équipe : ${error.message}`)
          setTeamApiStatus('error')
        }
      } finally {
        setSaving(false)
      }
      return
    }
    persist(nextData, 'Le contenu a été supprimé.')
  }

  function selectModule(key) {
    setActiveKey(key)
    if (key === 'home') setActiveSection('hero')
    if (key === 'club') setActiveSection('identity')
    if (key === 'team') setActiveSection('group')
    if (key === 'settings') setActiveSection('contact')
    if (key === 'matches') setActiveSection('matches')
    if (key === 'shop') setActiveSection('manager')
    setSearch('')
    setSidebarOpen(false)
  }

  const Icon = activeModule ? (adminIcons[activeModule.icon] ?? FilePlus2) : LayoutDashboard

  return (
    <div className="admin-app">
      <aside className={`admin-sidebar ${sidebarOpen ? 'is-open' : ''}`}>
        <Link className="admin-brand" to="/" aria-label="Guediawaye FC, retour au site">
          <span className="admin-brand__crest"><img src="/logo-1.png" alt="" /></span>
          <span><strong>GUEDIAWAYE FC</strong><small>ESPACE ADMIN</small></span>
        </Link>
        <div className="admin-sidebar__label">MENU PRINCIPAL</div>
        <button className={`admin-nav-item ${activeKey === 'dashboard' ? 'is-active' : ''}`} type="button" onClick={() => selectModule('dashboard')}>
          <LayoutDashboard size={18} /><span>Tableau de bord</span>
        </button>
        <div className="admin-sidebar__label admin-sidebar__label--spaced">GESTION DU SITE</div>
        <nav className="admin-nav">
          {adminModules.map((module) => {
            const ModuleIcon = adminIcons[module.icon] ?? FilePlus2
            return (
              <button
                className={`admin-nav-item ${activeKey === module.key ? 'is-active' : ''}`}
                key={module.key}
                type="button"
                onClick={() => selectModule(module.key)}
              >
                <ModuleIcon size={18} /><span>{module.label}</span><small>{(data[module.key] ?? []).length}</small>
              </button>
            )
          })}
        </nav>
        {user.role === 'DEVELOPER' && (
          <button className={`admin-nav-item ${activeKey === 'accounts' ? 'is-active' : ''}`} type="button" onClick={() => selectModule('accounts')}>
            <UsersRound size={18} /><span>Profils administrateur</span>
          </button>
        )}
        <div className="admin-sidebar__bottom">
          <div className="admin-sidebar__profile"><span className="admin-avatar">{user.displayName.slice(0, 1).toLocaleUpperCase('fr')}</span><span><strong>{user.displayName}</strong><small>{user.role === 'DEVELOPER' ? 'Développeur permanent' : 'Administrateur du site'}</small></span></div>
          <button className="admin-back-link admin-back-link--action" type="button" onClick={() => selectModule('password')}><LockKeyhole size={16} /> Modifier mon mot de passe</button>
          <button className="admin-back-link admin-back-link--logout" type="button" onClick={onLogout}><LogOut size={16} /> Se déconnecter</button>
          <Link className="admin-back-link" to="/"><ExternalLink size={16} /> Voir le site</Link>
        </div>
      </aside>
      {sidebarOpen && <button className="admin-sidebar-scrim" type="button" aria-label="Fermer le menu" onClick={() => setSidebarOpen(false)} />}
      <main className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar__left">
            <button className="admin-icon-button admin-menu-button" type="button" aria-label="Ouvrir le menu" onClick={() => setSidebarOpen(true)}><Menu size={20} /></button>
            <div className="admin-breadcrumb"><span>Administration</span><ChevronRight size={14} /><strong>{activeKey === 'accounts' ? 'Profils administrateur' : activeKey === 'password' ? 'Mon mot de passe' : activeModule?.label ?? 'Tableau de bord'}</strong></div>
          </div>
          <div className="admin-topbar__right">
            <span className={`admin-topbar__status admin-topbar__status--${activeApiStatus}`}><i /> {activeKey === 'news'
              ? newsApiStatus === 'ready' ? 'Actualités synchronisées' : newsApiStatus === 'saving' ? 'Synchronisation...' : newsApiStatus === 'error' ? 'Backend indisponible' : 'Connexion MySQL...'
              : activeKey === 'club'
              ? clubApiStatus === 'ready' ? 'Club synchronisé' : clubApiStatus === 'saving' ? 'Synchronisation...' : clubApiStatus === 'error' ? 'Backend indisponible' : 'Connexion MySQL...'
              : activeKey === 'team'
                ? teamApiStatus === 'ready' ? 'Équipe synchronisée' : teamApiStatus === 'saving' ? 'Synchronisation...' : teamApiStatus === 'error' ? 'Backend indisponible' : 'Connexion MySQL...'
                : activeKey === 'settings'
                  ? contactApiStatus === 'ready' ? 'Contact synchronisé' : contactApiStatus === 'saving' ? 'Synchronisation...' : contactApiStatus === 'error' ? 'Backend indisponible' : 'Connexion MySQL...'
                  : activeKey === 'matches'
                    ? matchesApiStatus === 'ready' ? 'Calendrier synchronisé' : matchesApiStatus === 'saving' ? 'Synchronisation...' : matchesApiStatus === 'error' ? 'Backend indisponible' : 'Connexion MySQL...'
                  : activeKey === 'shop'
                    ? shopApiStatus === 'ready' ? 'Boutique synchronisée' : shopApiStatus === 'saving' ? 'Synchronisation...' : shopApiStatus === 'error' ? 'Backend indisponible' : 'Connexion MySQL...'
                  : apiStatus === 'ready' ? 'Accueil synchronisé' : apiStatus === 'saving' ? 'Synchronisation...' : apiStatus === 'error' ? 'Backend indisponible' : 'Connexion MySQL...'}</span>
            <span className="admin-avatar">{user.displayName.slice(0, 1).toLocaleUpperCase('fr')}</span>
          </div>
        </header>
        <div className="admin-content">
          {storageError && <div className="admin-alert" role="alert"><ShieldCheck size={17} /><span>{storageError}</span><button type="button" onClick={() => setStorageError('')} aria-label="Fermer"><X size={16} /></button></div>}
          {apiError && <div className="admin-alert" role="alert"><ShieldCheck size={17} /><span>{apiError}</span><button className="admin-alert__retry" type="button" onClick={loadHomeFromApi} disabled={apiStatus === 'loading'}>Réessayer</button></div>}
          {clubApiError && <div className="admin-alert" role="alert"><ShieldCheck size={17} /><span>{clubApiError}</span><button className="admin-alert__retry" type="button" onClick={loadClubFromApi} disabled={clubApiStatus === 'loading'}>Réessayer</button></div>}
          {teamApiError && <div className="admin-alert" role="alert"><ShieldCheck size={17} /><span>{teamApiError}</span><button className="admin-alert__retry" type="button" onClick={loadTeamFromApi} disabled={teamApiStatus === 'loading'}>Réessayer</button></div>}
          {newsApiError && <div className="admin-alert" role="alert"><ShieldCheck size={17} /><span>{newsApiError}</span><button className="admin-alert__retry" type="button" onClick={loadNewsFromApi} disabled={newsApiStatus === 'loading'}>Réessayer</button></div>}
          {contactApiError && <div className="admin-alert" role="alert"><ShieldCheck size={17} /><span>{contactApiError}</span><button className="admin-alert__retry" type="button" onClick={loadContactFromApi} disabled={contactApiStatus === 'loading'}>Réessayer</button></div>}
          {matchesApiError && <div className="admin-alert" role="alert"><ShieldCheck size={17} /><span>{matchesApiError}</span><button className="admin-alert__retry" type="button" onClick={loadMatchesFromApi} disabled={matchesApiStatus === 'loading'}>Réessayer</button></div>}
          {shopApiError && <div className="admin-alert" role="alert"><ShieldCheck size={17} /><span>{shopApiError}</span><button className="admin-alert__retry" type="button" onClick={loadShopFromApi} disabled={shopApiStatus === 'loading'}>Réessayer</button></div>}
          {notice && <div className="admin-toast" role="status"><Check size={17} />{notice}</div>}
          {activeKey === 'accounts' ? (
            <AdminAccountsPanel />
          ) : activeKey === 'password' ? (
            <AdminPasswordPanel user={user} onUserUpdated={onUserUpdated} />
          ) : activeKey === 'dashboard' ? (
            <Dashboard data={data} onOpenModule={selectModule} />
          ) : activeModule ? (
            <>
              <div className="admin-page-heading">
                <div className="admin-page-heading__title">
                  <span className="admin-page-icon"><Icon size={20} /></span>
                  <div><span className="admin-eyebrow">CONTENU DU SITE</span><h1>{activeModule.label}</h1><p>{activeModule.description}</p></div>
                </div>
                {!(activeModule.singleRecord || activeModule.singleRecordSections?.includes(activeSection) || activeModule.fixedRecordCountSections?.includes(activeSection)) && (
                  <button className="admin-button admin-button--primary" type="button" disabled={clubFigureLimitReached || (activeKey === 'home' && (apiStatus !== 'ready' || saving)) || (activeKey === 'club' && (clubApiStatus !== 'ready' || saving)) || (activeKey === 'team' && (teamApiStatus !== 'ready' || saving)) || (activeKey === 'news' && (newsApiStatus !== 'ready' || saving)) || (activeKey === 'settings' && (contactApiStatus !== 'ready' || saving)) || (activeKey === 'matches' && (matchesApiStatus !== 'ready' || saving)) || (activeKey === 'shop' && (shopApiStatus !== 'ready' || saving))} onClick={() => setIsCreating(true)}>
                    <Plus size={17} /> {activeModule.addButtonLabels?.[activeSection] ?? 'Ajouter'}
                  </button>
                )}
              </div>
              {activeModule.sections && (
                <nav className="admin-section-tabs" aria-label={`Sections de ${activeModule.label}`}>
                  {activeModule.sections.map((section) => (
                    <button
                      className={activeSection === section.key ? 'is-active' : ''}
                      type="button"
                      key={section.key}
                      onClick={() => { setActiveSection(section.key); setSearch('') }}
                    >
                      <span>{section.label}</span>
                      <small>{items.filter((item) => item.group === section.key).length}</small>
                    </button>
                  ))}
                </nav>
              )}
              {activeSectionDefinition && <p className="admin-section-description">{activeSectionDefinition.description}</p>}
              {clubFigureLimitReached && <p className="admin-section-description">La limite de 9 figures est atteinte. Supprimez une figure pour en ajouter une autre.</p>}
              {activeKey === 'news' && <p className="admin-section-description">{items.filter((item) => item.featured).length}/3 actualités sélectionnées à la une sur la page d’accueil.</p>}
              <div className="admin-list-toolbar">
                <div className="admin-list-toolbar__count"><strong>{sectionItems.length}</strong> élément{sectionItems.length > 1 ? 's' : ''}</div>
                <label className="admin-search"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Rechercher..." /><kbd>⌘ K</kbd></label>
              </div>
              <section className={`admin-items ${activeKey === 'settings' ? 'admin-items--settings' : ''}`}>
                {filteredItems.length ? filteredItems.map((item) => (
                  <article className="admin-item-card" key={item.id}>
                    <PreviewValue
                      module={activeModule}
                      item={item}
                      opponents={activeKey === 'matches' ? items.filter((entry) => entry.group === 'opponents') : []}
                      categories={activeKey === 'shop' ? items.filter((entry) => entry.group === 'categories') : []}
                    />
                    <div className="admin-item-card__status">
                      {isPastMatchMissingScore(item) && <span className="admin-match-warning" aria-label="Score manquant pour ce match">Score manquant</span>}
                      {item.published === false ? <span className="admin-status admin-status--draft"><i /> Brouillon</span> : <span className="admin-status"><i /> {activeKey === 'settings' || activeKey === 'matches' ? item.group === 'matches' ? ({ scheduled: 'À venir', live: 'En cours', completed: 'Terminé' }[item.status] ?? 'Configuré') : 'Configuré' : 'Publié'}</span>}
                    </div>
                    <div className="admin-item-card__actions">
                      {activeKey === 'news' && <button className={`admin-icon-button admin-featured-toggle ${item.featured ? 'is-featured' : ''}`} type="button" aria-label={item.featured ? 'Retirer des actualités à la une' : 'Mettre à la une'} aria-pressed={Boolean(item.featured)} disabled={newsApiStatus !== 'ready' || saving} onClick={() => saveItem({ ...item, featured: !item.featured })}><Star size={16} fill={item.featured ? 'currentColor' : 'none'} /></button>}
                      <button className="admin-icon-button" type="button" aria-label="Modifier" disabled={(activeKey === 'home' && (apiStatus !== 'ready' || saving)) || (activeKey === 'club' && (clubApiStatus !== 'ready' || saving)) || (activeKey === 'team' && (teamApiStatus !== 'ready' || saving)) || (activeKey === 'news' && (newsApiStatus !== 'ready' || saving)) || (activeKey === 'settings' && (contactApiStatus !== 'ready' || saving)) || (activeKey === 'matches' && (matchesApiStatus !== 'ready' || saving)) || (activeKey === 'shop' && (shopApiStatus !== 'ready' || saving))} onClick={() => setEditorItem(item)}><Pencil size={16} /></button>
                      {!(activeModule.singleRecord || activeModule.singleRecordSections?.includes(item.group) || activeModule.fixedRecordCountSections?.includes(item.group)) && <button className="admin-icon-button admin-icon-button--danger" type="button" aria-label="Supprimer" disabled={(activeKey === 'home' && (apiStatus !== 'ready' || saving)) || (activeKey === 'club' && (clubApiStatus !== 'ready' || saving)) || (activeKey === 'team' && (teamApiStatus !== 'ready' || saving)) || (activeKey === 'news' && (newsApiStatus !== 'ready' || saving)) || (activeKey === 'settings' && (contactApiStatus !== 'ready' || saving)) || (activeKey === 'matches' && (matchesApiStatus !== 'ready' || saving)) || (activeKey === 'shop' && (shopApiStatus !== 'ready' || saving))} onClick={() => deleteItem(item)}><Trash2 size={16} /></button>}
                      {(item.image || item.logo) && <a className="admin-icon-button" href={item.image ?? item.logo} target="_blank" rel="noreferrer" aria-label="Voir l’image"><Eye size={16} /></a>}
                    </div>
                  </article>
                )) : (
                  <div className="admin-empty"><Search size={25} /><strong>Aucun résultat</strong><span>Essayez un autre terme ou ajoutez un contenu.</span></div>
                )}
              </section>
              <div className="admin-pagination"><span>Affichage de {filteredItems.length} sur {sectionItems.length} éléments</span><div><button type="button" aria-label="Page précédente" disabled><ChevronLeft size={17} /></button><button className="is-current" type="button">1</button><button type="button" aria-label="Page suivante" disabled><ChevronRight size={17} /></button></div></div>
              <div className="admin-local-note"><ShieldCheck size={16} /><span>{activeKey === 'home'
                ? 'Les modifications de l’accueil sont enregistrées dans MySQL et affichées sur le site. Les autres rubriques restent enregistrées localement.'
                : activeKey === 'news'
                  ? 'Les actualités, leurs galeries et les trois éléments à la une sont enregistrés dans MySQL et publiés sur le site.'
                : activeKey === 'club'
                  ? 'Les modifications du club sont enregistrées dans MySQL et affichées sur la page publique.'
                  : activeKey === 'team'
                    ? 'Les modifications de l’équipe et du staff sont enregistrées dans MySQL et affichées sur la page publique.'
                    : activeKey === 'settings'
                      ? 'Les coordonnées et les questions fréquentes sont enregistrées dans MySQL et affichées sur la page contact.'
                    : activeKey === 'matches'
                      ? 'Les équipes adverses et le calendrier sont enregistrés dans MySQL et affichés sur le site. Le prochain match ou le match en cours est choisi automatiquement.'
                      : activeKey === 'shop'
                        ? 'Les coordonnées du gérant, les catégories et les produits sont enregistrés dans MySQL et affichés sur la boutique.'
                    : 'Cette rubrique est enregistrée localement dans ce navigateur et n’est pas encore synchronisée avec MySQL.'}</span><button type="button" onClick={() => selectModule('settings')}><Settings size={15} /> Paramètres</button></div>
            </>
          ) : null}
          <footer className="admin-footer"><span>© 2026 Guediawaye FC · Interface d’administration</span><span><ArrowDownRight size={14} /> Version de prévisualisation</span></footer>
        </div>
      </main>
      {(isCreating || editorItem) && activeModule && (
        <AdminEditor
          module={activeModule}
          item={editorItem}
          group={activeModule.sections ? activeSection : undefined}
          moduleItems={data[activeKey] ?? []}
          saving={saving}
          onClose={() => { setIsCreating(false); setEditorItem(null) }}
          onSave={saveItem}
        />
      )}
      <Link className="admin-floating-site-link" to="/" aria-label="Retour au site"><ExternalLink size={17} /></Link>
    </div>
  )
}

export default function AdminPage() {
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [authError, setAuthError] = useState('')

  useEffect(() => {
    let active = true
    const handleExpiredSession = () => {
      setUser(null)
      setAuthError('Votre session a expiré ou votre compte a été bloqué. Veuillez vous reconnecter.')
    }
    window.addEventListener('gfc-admin-session-expired', handleExpiredSession)
    fetchCurrentAdmin()
      .then((currentUser) => {
        if (active) setUser(currentUser)
      })
      .catch((error) => {
        if (active) setAuthError(error.message)
      })
      .finally(() => {
        if (active) setAuthLoading(false)
      })
    return () => {     active = false
    window.removeEventListener('gfc-admin-session-expired', handleExpiredSession) }
  }, [])

  async function signIn(username, password) {
    const loggedInUser = await loginAdmin(username, password)
    setUser(loggedInUser)
    setAuthError('')
  }

  async function signOut() {
    try {
      await logoutAdmin()
      setUser(null)
    } catch (error) {
      setAuthError(error.message)
    }
  }

  if (authLoading) {
    return <main className="admin-auth"><div className="admin-auth__loading">Vérification de la session...</div></main>
  }
  if (!user) {
    return <><AdminLoginScreen onLogin={signIn} />{authError && <p className="admin-auth__global-error" role="alert">{authError}</p>}</>
  }
  if (user.passwordChangeRequired) {
    return <main className="admin-auth"><AdminPasswordPanel user={user} forced onUserUpdated={setUser} /></main>
  }
  return <AdminWorkspace user={user} onLogout={signOut} onUserUpdated={setUser} />
}
