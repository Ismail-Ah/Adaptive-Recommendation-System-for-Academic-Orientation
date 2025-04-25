from django.apps import AppConfig


class ModelservConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'modelServ'

    def ready(self):
        from .eureka_client import init_eureka_client
        init_eureka_client()
